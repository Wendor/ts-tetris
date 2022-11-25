import { CellType } from "./types/CellType.js";
export const shapes = [
    [
        [1, 1],
        [1, 1],
    ],
    [
        [1, 1, 1, 1],
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
    ],
    [
        [1, 1, 1],
        [0, 0, 1],
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
    ],
];
export class Shape {
    x;
    y;
    grid;
    shape;
    constructor(grid, shape = undefined) {
        this.grid = grid;
        if (shape) {
            this.shape = shape;
        }
        else {
            this.shape = shapes[Math.floor(Math.random() * shapes.length)];
            if (Math.random() > 0.5) {
                this.shape = this.shape.reverse();
            }
            const rotateTimes = Math.floor(Math.random() * 4);
            for (let i = 0; i < rotateTimes; i++) {
                this.shape = this.rotatedShape();
            }
        }
        this.x = Math.floor(grid.cols / 2) - Math.floor(this.shape[0].length / 2);
        this.y = 0;
    }
    tick() {
        this.draw(CellType.empty);
        if (this.canMove({ x: 0, y: 1 })) {
            this.y += 1;
        }
        this.draw(CellType.shape);
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
    canMove(offset, shape = undefined) {
        const map = this.grid.getMap();
        if (!shape)
            shape = this.shape;
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
    move(offset) {
        if (!this.canMove(offset))
            return;
        this.draw(CellType.empty);
        this.x += offset.x;
        this.y += offset.y;
        this.draw(CellType.shape);
    }
    moveDown() {
        for (let y = 0; y < this.grid.getMap().length - 1; y++) {
            if (this.canMove({ x: 0, y })) {
                this.move({ x: 0, y });
            }
            else {
                break;
            }
        }
    }
    rotate() {
        const shape = this.rotatedShape();
        if (this.canMove({ x: 0, y: 0 }, shape)) {
            this.draw(CellType.empty);
            this.shape = shape;
            this.draw(CellType.shape);
        }
    }
    rotatedShape() {
        return this.shape[0].map((row, idx) => {
            return this.shape.map((r) => r[idx]).reverse();
        });
    }
    update() {
    }
}
//# sourceMappingURL=Shape.js.map