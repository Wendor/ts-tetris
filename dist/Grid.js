export class Grid extends EventTarget {
    cols = 10;
    rows = 20;
    offset = 0;
    grid;
    map;
    queue = [];
    constructor(el, cols = 10, rows = 20, offset = 0) {
        super();
        this.cols = cols;
        this.rows = rows;
        this.offset = offset;
        this.grid = document.getElementById(el);
        this.map = (new Array(this.rows))
            .fill([])
            .map(() => (new Array(this.cols)).fill(0));
        this.createDom();
    }
    createDom() {
        this.grid.innerHTML = '';
        for (let i = this.offset; i < this.rows; i++) {
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
            const cell = document.querySelector(`#${this.grid.id} [data-x="${point.x}"][data-y="${point.y}"]`);
            if (!cell)
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
}
//# sourceMappingURL=Grid.js.map