import { Grid } from 'Grid';
import { CellType } from './types/CellType';

export class Tetramino {
  public x: number;
  public y: number;
  public grid: Grid;
  public shape: number[][];

  constructor(grid: Grid, shape: number[][], position = 'top') {
    this.grid = grid;
    this.shape = shape;

    this.x = Math.ceil(grid.cols/2) - Math.ceil(this.shape[0].length / 2);
    this.y = 0;

    if (position == 'middle') {
      this.y = Math.floor(grid.cols/2) - Math.floor(this.shape[0].length / 2);
    }
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

  public undraw() {
    this.draw(CellType.empty);
  }
}
