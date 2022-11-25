import { Shape } from './Shape';
import { Grid } from './Grid';
import { CellType } from './types/CellType';

export class Game {
  private grid = new Grid();
  private speed = 500;
  private shape = new Shape(this.grid);
  private nextShape = new Shape(this.grid);
  private lastTickTime = 0;
  public gameOver = false;

  constructor() {
    this.initControls();
    window.requestAnimationFrame((t) => this.update(t));
  }

  private initControls() {
    let touchstartX = 0;
    let touchendX = 0;
    let touchstartY = 0;
    let touchendY = 0;

    document.addEventListener('touchstart', e => {
      touchstartX = e.changedTouches[0].screenX;
      touchstartY = e.changedTouches[0].screenY;
    })

    document.addEventListener('touchend', e => {
      if (this.gameOver) return;
      touchendX = e.changedTouches[0].screenX;
      touchendY = e.changedTouches[0].screenY;

      const xDiff = touchendX - touchstartX;
      const yDiff = touchendY - touchstartY;
      const vertical = Math.abs(yDiff) > Math.abs(xDiff);
      const diff = vertical ? yDiff : xDiff;

      if (Math.abs(diff) < 10) {
        this.shape.rotate();
        return;
      }

      if (!vertical && xDiff < 0) {
        this.shape.move({ x: -1, y: 0});
        return;
      }
      if (!vertical && xDiff > 0) {
        this.shape.move({ x: 1, y: 0});
        return;
      }

      if (vertical && yDiff > 0) {
        this.shape.moveDown();
      }

    });

    document.addEventListener('keydown', (event) => {
      if (this.gameOver) return;
      if (event.key == "ArrowRight") {
          this.shape.move({ x: 1, y: 0});
      }

      if (event.key == "ArrowLeft") {
        this.shape.move({ x: -1, y: 0});
      }

      if (event.key == "ArrowUp") {
        this.shape.rotate();
      }

      if (event.key == "ArrowDown") {
        this.shape.moveDown();
      }
    });
  }

  private tick() {
    if (this.gameOver) {
      return;
    }
    if (!this.shape.canMove({ x: 0, y: 1})) {
      this.shape.draw(CellType.wall);
      this.shape = this.nextShape;
      this.nextShape = new Shape(this.grid);
      if (!this.shape.canMove({ x: 0, y: 0})) {
        this.gameOver = true;
      }
      this.shape.draw();
    }
    this.shape.tick();
    this.grid.hideRows();
  }

  private update(timestamp: number) {
    if (timestamp - this.lastTickTime > this.speed) {
      this.lastTickTime = timestamp;
      this.tick();
    }
    this.shape.draw();

    this.grid.update();
    this.shape.update();
    window.requestAnimationFrame((t) => this.update(t));
  }
}

const game = new Game();
