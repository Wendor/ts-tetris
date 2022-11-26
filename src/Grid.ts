import { Point } from './types/Point';

export class Grid extends EventTarget {
  public cols: number = 10;
  public rows: number = 20;
  public grid: HTMLElement;
  public map: number[][];
  public queue: Point[] = [];

  constructor(el: string, cols = 10, rows = 20) {
    super();
    this.cols = cols;
    this.rows = rows;
    this.grid = document.getElementById(el) as HTMLElement;

    this.map = (new Array(this.rows))
      .fill([])
      .map(() => (new Array(this.cols)).fill(0));

    this.createDom();
  }

  private createDom() {
    this.grid.innerHTML = '';
    for (let i = 0; i < this.rows; i++) {
      const row = document.createElement('div');
      row.classList.add('row');

      for (let j = 0; j < this.cols; j++) {
        const cell = document.createElement('div');
        cell.classList.value = 'cell type-0';
        cell.dataset.x = j.toString();
        cell.dataset.y = i.toString();
        row.appendChild(cell);
      }

      this.grid.appendChild(row);
    }
  }

  public update() {
    // remove duplicate coordinates
    this.queue = this.queue
      .reverse()
      .filter((point, index, self) => {
        return index === self.findIndex((t) => {
          return t.x == point.x && t.y == point.y;
        });
      });

    // draw points on grid
    while(this.queue.length) {
      const point = this.queue.shift();
      if (!point) break;

      const cell = document.querySelector(`#${this.grid.id} [data-x="${point.x}"][data-y="${point.y}"]`) as HTMLElement;
      if (!cell) break;

      cell.classList.value = 'cell';
      cell.classList.add(`type-${point.type}`);
    }
  }

  public addQueue(point: Point) {
    this.map[point.y][point.x] = point.type;
    this.queue.push(point);
  }

  public getMap() {
    return this.map;
  }
}
