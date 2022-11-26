import { Tetramino } from './Tetramino';
import { CellType } from './types/CellType';

export class Shape extends Tetramino {
  public tick() {
    this.draw(CellType.empty);
    if (this.canMove({ x: 0, y: 1})) {
      this.y += 1;
    }
    this.draw(CellType.shape);
  }

  public canMove(offset: { x: number; y: number }, shape: number[][] | undefined = undefined) {
    const map = this.grid.getMap();
    if (!shape) shape = this.shape;

    for (let y in shape) {
      for (let x in shape[y]) {
        const yCoord = parseInt(y) + this.y + offset.y;
        const xCoord = parseInt(x) + this.x + offset.x;
        if (shape[y][x] == 0) {
          continue;
        }
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
}
