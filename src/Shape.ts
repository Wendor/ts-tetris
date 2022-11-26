import { Grid } from "Grid";
import { CellType } from "./types/CellType";

export const shapes = [
  [
    [1,1],
    [1,1],
  ],
  [
    [1,1,1,1],
  ],
  [
    [1,1,0],
    [0,1,1],
  ],
  [
    [1,1,1],
    [0,0,1],
  ],
  [
    [0,1,0],
    [1,1,1],
  ],
];


export class Shape {
  public x: number;
  public y: number;
  public grid: Grid;
  public shape: number[][];

  constructor(grid: Grid, shape: number[][] | undefined = undefined) {
    this.grid = grid;

    if (shape) {
      this.shape = shape;
    } else {
      this.shape = shapes[Math.floor(Math.random() * shapes.length)];

      if (Math.random() > 0.5) {
        this.shape = this.shape.reverse();
      }

      const rotateTimes = Math.floor(Math.random() * 4);
      for (let i = 0; i < rotateTimes; i++) {
        this.shape = this.rotatedShape();
      }
    }

    this.x = Math.floor(grid.cols/2) - Math.floor(this.shape[0].length / 2);
    this.y = 0;
  }

  public tick() {
    this.draw(CellType.empty);
    if (this.canMove({ x: 0, y: 1})) {
      this.y += 1;
    }
    this.draw(CellType.shape);
  }

  public draw(type = CellType.shape) {
    for (let j = 0; j < this.shape.length; j++) {
      for (let i = 0; i < this.shape[0].length; i++) {
        if (this.shape[j][i]) {
          this.grid.addQueue({
            y: this.y + j,
            x: this.x + i,
            type: type,
          });
        }
      }
    }
  }

  public canMove(offset: { x: number; y: number }, shape: number[][] | undefined = undefined) {
    const map = this.grid.getMap();
    if (!shape) shape = this.shape;

    for (let y in shape) {
      for (let x in shape[y]) {
        const yCoord = parseInt(y) + this.y + offset.y;
        const xCoord = parseInt(x) + this.x + offset.x;
        if (map[yCoord] == undefined || map[yCoord][xCoord] == undefined) {
          return false;
        }
        if (shape[y][x] && map[yCoord] && map[yCoord][xCoord] == CellType.wall) {
          return false;
        }
      }
    }
    return true;
  }

  public move(offset: { x: number; y: number}) {
    if (!this.canMove(offset)) return;
    this.draw(CellType.empty);
    this.x += offset.x;
    this.y += offset.y;
    this.draw(CellType.shape);
  }

  public moveDown() {
    let offset = 0;
    for (let y = 0; y < this.grid.getMap().length - 1; y++) {
      if (!this.canMove({ x: 0, y })) {
        break;
      }
      offset = y;
    }
    this.move({ x: 0, y: offset });
  }

  public rotate() {
    const shape = this.rotatedShape();
    if (this.canMove({ x: 0, y: 0 }, shape)) {
      this.draw(CellType.empty);
      this.shape = shape;
      this.draw(CellType.shape);
    }
  }

  private rotatedShape() {
    return this.shape[0].map((row, idx) => {
      return this.shape.map((r) => r[idx]).reverse();
    });
  }

  update() {

  }
}
