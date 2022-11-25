import { CellType } from "./types/CellType.js";
export class Grid {
    cols = 10;
    rows = 20;
    grid;
    map;
    queue = [];
    constructor() {
        this.grid = document.getElementById('grid');
        this.calcSize();
        window.addEventListener('resize', () => this.calcSize());
        this.map = (new Array(this.rows))
            .fill([])
            .map(() => (new Array(this.cols)).fill(0));
        this.createDom();
    }
    calcSize() {
        const root = document.documentElement;
        let size = Math.floor((root.scrollWidth - this.cols - 65) / this.cols);
        if (root.scrollHeight < size * this.rows + 65) {
            size = Math.floor((root.scrollHeight - this.rows - 65) / this.rows);
        }
        root.style.setProperty('--cell-size', size + 'px');
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
            const cell = document.querySelector(`#grid [data-x="${point.x}"][data-y="${point.y}"]`);
            if (!point)
                break;
            cell.classList.value = 'cell';
            cell.classList.add(`type-${point.type}`);
        }
    }
    addQueue(point) {
        if (this.map[point.y][point.x] == CellType.shape && point.type !== CellType.shape) {
            this.removeShadow(point);
        }
        this.map[point.y][point.x] = point.type;
        this.queue.push(point);
        if (point.type == CellType.shape) {
            this.addShadow(point);
        }
    }
    addShadow(point) {
        for (let y = point.y + 1; y < this.rows; y++) {
            if (this.map[y][point.x] != CellType.empty) {
                break;
            }
            this.addQueue({
                x: point.x,
                y,
                type: CellType.shadow,
            });
        }
    }
    removeShadow(point) {
        for (let y = point.y + 1; y < this.rows; y++) {
            if (this.map[y][point.x] != CellType.shadow) {
                break;
            }
            this.addQueue({
                x: point.x,
                y,
                type: CellType.empty,
            });
        }
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
//# sourceMappingURL=Grid.js.map