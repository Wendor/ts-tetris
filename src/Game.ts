import { Shape } from './Shape';
import { Grid } from './Grid';
import { CellType } from './types/CellType';
import { GameInput } from './GameInput';
import { SevenBag } from './generators/SevenBag';
import { Glass } from './Glass';
import { Tetramino } from './Tetramino';

export class Game {
  private grid = new Glass('grid');
  private hint = new Grid('hint', 4, 4);
  private speed = 500;
  private shape: Shape;
  private hintShape: Tetramino;
  private lastTickTime = 0;
  private resetTickTime = false;
  public gameOver = false;
  public tetraminoQueue: number[][][] = [];
  public generator = new SevenBag();

  constructor() {
    this.shape = new Shape(this.grid, this.generator.get());
    this.tetraminoQueue = (new Array(4))
      .fill([])
      .map(() => this.generator.get());

    this.hintShape = new Tetramino(this.hint, this.tetraminoQueue[0], 'middle');

    this.initInput();
    window.requestAnimationFrame((t) => this.update(t));
  }

  private initInput() {
    const input = new GameInput();
    input.addEventListener('rotate', () => this.onRotate());
    input.addEventListener('moveLeft', () => this.onMoveLeft());
    input.addEventListener('moveRight', () => this.onMoveRight());
    input.addEventListener('moveDown', () => this.onMoveDown());
  }

  private onRotate() {
    if (this.gameOver) return;
    this.shape.rotate();
    this.resetTickTime = true;
  }

  private onMoveLeft() {
    if (this.gameOver) return;
    this.shape.move({ x: -1, y: 0});
  }

  private onMoveRight() {
    if (this.gameOver) return;
    this.shape.move({ x: 1, y: 0});
  }

  private onMoveDown() {
    if (this.gameOver) return;
    this.shape.moveDown();
    this.resetTickTime = true;
  }

  private newTetramino() {
    const tetramino = this.tetraminoQueue.shift();
    if (!tetramino) throw new Error('unknown error');

    if (this.shape) {
      this.shape.draw(CellType.wall);
    }

    if (this.hintShape) {
      this.hintShape.undraw();
    }

    this.shape = new Shape(this.grid, tetramino);
    this.hintShape = new Tetramino(this.hint, this.tetraminoQueue[0], 'middle');
    this.tetraminoQueue.push(this.generator.get());
  }

  private tick() {
    if (this.gameOver) {
      return;
    }
    if (!this.shape.canMove({ x: 0, y: 1})) {
      this.newTetramino();
      if (!this.shape.canMove({ x: 0, y: 0})) {
        this.gameOver = true;
      }
      this.shape.draw();
      this.hintShape.draw();
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
    this.hintShape.draw();

    this.grid.update();
    this.hint.update();;
    window.requestAnimationFrame((t) => this.update(t));
  }
}

const game = new Game();
