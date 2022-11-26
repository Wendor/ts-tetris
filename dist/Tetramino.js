import { CellType } from './types/CellType.js';
export class Tetramino {
    x;
    y;
    grid;
    shape;
    constructor(grid, shape, position = 'top') {
        this.grid = grid;
        this.shape = shape;
        this.x = Math.ceil(grid.cols / 2) - Math.ceil(this.shape[0].length / 2);
        this.y = 0;
        if (position == 'middle') {
            this.y = Math.floor(grid.cols / 2) - Math.floor(this.shape[0].length / 2);
        }
    }
    draw(type = CellType.shape) {
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
    undraw() {
        this.draw(CellType.empty);
    }
}
//# sourceMappingURL=Tetramino.js.map