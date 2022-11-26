import { Shape } from './Shape';
import { Grid } from './Grid';
import { CellType } from './types/CellType';
import { GameInput } from './GameInput';
import { SevenBag } from './generators/SevenBag';
import { Glass } from './Glass';
import { Tetramino } from './Tetramino';

export class Game {
  private glass = new Glass('grid');
  private hint = new Grid('hint', 4, 4);
  private speed = 500;
  private shape: Shape;
  private hintShape: Tetramino;
  private lastTickTime = 0;
  private resetTickTime = false;
  private statusDiv: HTMLElement | null | undefined;
  private scoreDiv: HTMLElement | null | undefined;
  private linesDiv: HTMLElement | null | undefined;
  private score = 0;
  private lines = 0;
  public gameOver = false;
  public isPaused = false;
  public tetraminoQueue: number[][][] = [];
  public generator = new SevenBag();

  constructor() {
    this.shape = new Shape(this.glass, this.generator.get());
    this.tetraminoQueue = (new Array(4))
      .fill([])
      .map(() => this.generator.get());

    this.hintShape = new Tetramino(this.hint, this.tetraminoQueue[0], 'middle');

    this.initInput();

    this.glass.addEventListener('score', (e: any) => this.onScore(e));

    this.statusDiv = document.getElementById('status');
    this.scoreDiv = document.getElementById('score');
    this.linesDiv = document.getElementById('lines');

    window.requestAnimationFrame((t) => this.update(t));
  }

  private initInput() {
    const input = new GameInput();
    input.addEventListener('rotate', () => this.onRotate());
    input.addEventListener('moveLeft', () => this.onMoveLeft());
    input.addEventListener('moveRight', () => this.onMoveRight());
    input.addEventListener('moveDown', () => this.onMoveDown());
    input.addEventListener('tooglePause', () => this.onTooglePause());
    input.addEventListener('pause', () => this.onPause());
  }

  private onRotate() {
    if (this.gameOver || this.isPaused) return;
    this.shape.rotate();
    this.resetTickTime = true;
  }

  private onMoveLeft() {
    if (this.gameOver || this.isPaused) return;
    this.shape.move({ x: -1, y: 0});
  }

  private onMoveRight() {
    if (this.gameOver || this.isPaused) return;
    this.shape.move({ x: 1, y: 0});
  }

  private onMoveDown() {
    if (this.gameOver || this.isPaused) return;
    this.shape.moveDown();
    this.resetTickTime = true;
  }

  private onTooglePause() {
    if (this.gameOver) {
      this.lines = 0;
      this.score = 0;
      this.glass = new Glass('grid');
      this.newTetramino();
      this.gameOver = false;
      this.isPaused = false;
      return;
    };
    this.isPaused = !this.isPaused;
  }

  private onPause() {
    if (this.gameOver) return;
    this.isPaused = true;
  }

  private onScore(e: CustomEvent<number>) {
    if (e.detail == 1) this.score += 100;
    if (e.detail == 2) this.score += 300;
    if (e.detail == 3) this.score += 700;
    if (e.detail == 4) this.score += 1500;

    this.lines += e.detail;
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

    this.shape = new Shape(this.glass, tetramino);
    this.hintShape = new Tetramino(this.hint, this.tetraminoQueue[0], 'middle');
    this.tetraminoQueue.push(this.generator.get());
  }

  private tick() {
    if (this.gameOver || this.isPaused) {
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
    this.glass.hideLines();
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

    this.glass.update();
    this.hint.update();
    this.updateTexts();

    window.requestAnimationFrame((t) => this.update(t));
  }

  private updateTexts() {
    if (this.gameOver || this.isPaused) {
      this.glass.grid.classList.add('paused');
      this.hint.grid.classList.add('paused');
    } else {
      this.glass.grid.classList.remove('paused');
      this.hint.grid.classList.remove('paused');
    }
    this.scoreDiv!.innerHTML = `Score: ${this.score}`;
    this.linesDiv!.innerHTML = `Lines: ${this.lines}`;
    if (this.gameOver) {
      this.statusDiv!.innerHTML = 'game over';
      return;
    }
    if (this.isPaused) {
      this.statusDiv!.innerHTML = 'paused';
      return;
    }
    this.statusDiv!.innerHTML = 'playing';
  }
}

let game = new Game();
