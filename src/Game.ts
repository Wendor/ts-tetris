import { Shape } from './Shape';
import { Grid } from './Grid';
import { CellType } from './types/CellType';
import { Keyboard } from './input/Keyboard';
import { Touch } from './input/Touch';

export class Game {
  private grid = new Grid();
  private speed = 500;
  private shape = new Shape(this.grid);
  private nextShape = new Shape(this.grid);
  private lastTickTime = 0;
  private resetTickTime = false;
  public gameOver = false;

  constructor() {
    this.initControls();
    window.requestAnimationFrame((t) => this.update(t));
  }

  private initControls() {
    const keyboard = new Keyboard();
    const touch = new Touch(this.grid);
    for (const input of [keyboard, touch]) {
      input.addEventListener('rotate', () => this.onRotate());
      input.addEventListener('moveLeft', () => this.onMoveLeft());
      input.addEventListener('moveRight', () => this.onMoveRight());
      input.addEventListener('moveDown', () => this.onMoveDown());
    }
  }

  onRotate() {
    if (this.gameOver) return;
    this.shape.rotate();
    this.resetTickTime = true;
  }

  onMoveLeft() {
    if (this.gameOver) return;
    this.shape.move({ x: -1, y: 0});
  }

  onMoveRight() {
    if (this.gameOver) return;
    this.shape.move({ x: 1, y: 0});
  }

  onMoveDown() {
    if (this.gameOver) return;
    this.shape.moveDown();
    this.resetTickTime = true;
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
    if (this.resetTickTime) {
      this.lastTickTime = timestamp;
      this.resetTickTime = false;
    }
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
