import { CellType } from "./types/CellType.js";
export class Grid {
    cols = 10;
    rows = 20;
    grid;
    map;
    queue = [];
    el = 'grid';
    constructor(el = 'grid', cols = 10, rows = 20) {
        this.cols = cols;
        this.rows = rows;
        this.el = el;
        this.grid = document.getElementById(el);
        this.map = (new Array(this.rows))
            .fill([])
            .map(() => (new Array(this.cols)).fill(0));
        this.createDom();
    }
    createDom() {
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
    update() {
        // remove duplicate coordinates
        this.queue = this.queue
            .reverse()
            .filter((point, index, self) => {
            return index === self.findIndex((t) => {
                return t.x == point.x && t.y == point.y;
            });
        });
        // draw points on grid
        while (this.queue.length) {
            const point = this.queue.shift();
            if (!point)
                break;
            const selector = `#${this.el} [data-x="${point.x}"][data-y="${point.y}"]`;
            const cell = document.querySelector(selector);
            if (!point)
                break;
            cell.classList.value = 'cell';
            cell.classList.add(`type-${point.type}`);
        }
    }
    addQueue(point) {
        this.map[point.y][point.x] = point.type;
        this.queue.push(point);
    }
    getMap() {
        return this.map;
    }
    hideRows() {
        for (let y in this.map) {
            const row = this.map[y];
            const walls = row.filter((c) => c == CellType.wall).length;
            if (row.length == walls) {
                this.moveDown(parseInt(y));
            }
        }
    }
    moveDown(targetY) {
        for (let y = targetY; y > 0; y--) {
            for (let x = 0; x < this.map[0].length; x++) {
                const type = this.map[y - 1][x] == CellType.shape
                    ? CellType.empty
                    : this.map[y - 1][x];
                this.addQueue({ x, y, type });
            }
        }
    }
}
//# sourceMappingURL=Grid%20copy.js.map