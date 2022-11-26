import { Grid } from './Grid.js';
import { CellType } from './types/CellType.js';
export class Glass extends Grid {
    addQueue(point) {
        if (this.map[point.y][point.x] == CellType.shape && point.type !== CellType.shape) {
            this.removeShadow(point);
        }
        super.addQueue(point);
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
    hideLines() {
        let hidedLines = 0;
        for (let y in this.map) {
            const row = this.map[y];
            const walls = row.filter((c) => c == CellType.wall).length;
            if (row.length == walls) {
                hidedLines += 1;
                this.moveDown(parseInt(y));
            }
        }
        if (hidedLines) {
            this.dispatchEvent(new CustomEvent('score', { detail: hidedLines }));
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
//# sourceMappingURL=Glass.js.map