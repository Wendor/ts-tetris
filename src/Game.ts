import { Shape } from './Shape';
import { Grid } from './Grid';
import { CellType } from './types/CellType';
import { GameInput } from './GameInput';
import { SevenBag } from './generators/SevenBag';
import { Glass } from './Glass';
import { Tetramino } from './Tetramino';
import { levelSpeed, linesToLevel, scoresForLine } from './Leveling';
import { HistoryRecord } from './types/HistoryRecord';
import { sha256 } from './Helpers';

export class Game {
  private callbackParams: Record<string, string>;
  private glass = new Glass('grid', 10, 22, 1);
  private hint = new Grid('hint', 4, 4);
  private shape!: Shape;
  private hintShape!: Tetramino;
  private lastTickTime = 0;
  private resetTickTime = false;
  private forceTick = false;
  private statusDiv: HTMLElement | null | undefined;
  private scoreDiv: HTMLElement | null | undefined;
  private linesDiv: HTMLElement | null | undefined;
  private score = 0;
  private totalLines = 0;
  private lines = 0;
  private level = 0;
  private speed = levelSpeed(0);
  private gameOver = false;
  private isPaused = false;
  private tetraminoQueue: number[][][] = [];
  private generator = new SevenBag();
  private history: HistoryRecord[] = [];

  constructor(callbackParams = {}) {
    this.callbackParams = callbackParams;
    this.statusDiv = document.getElementById('status');
    this.scoreDiv = document.getElementById('score');
    this.linesDiv = document.getElementById('lines');

    this.initInput();
    this.newGame();

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
    input.addEventListener('newGame', () => this.newGame());
  }

  private newGame() {
    this.totalLines = 0;
    this.lines = 0;
    this.score = 0;
    this.level = 0;
    this.speed = levelSpeed(this.level);

    this.glass = new Glass('grid');
    this.glass.addEventListener('score', (e: any) => this.onScore(e));

    this.tetraminoQueue = (new Array(4))
      .fill([])
      .map(() => this.generator.get());

    this.newShape();

    this.gameOver = false;
    this.isPaused = false;
  }

  private onRotate() {
    if (this.gameOver || this.isPaused) return;
    this.shape.rotate();
    if (this.shape.canMove({ x: 0, y: 1})) {
      this.resetTickTime = true;
    }
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
    /*
    if (this.shape.canMove({ x: 0, y: 1})) {
      this.resetTickTime = true;
    } else {
      this.forceTick = true;
    }
    */
    this.forceTick = true;
    this.shape.moveDown();
  }

  private onTooglePause() {
    const prevIsPaused = this.isPaused;
    if (this.gameOver) {
      this.newGame();
      return;
    }
    this.isPaused = !this.isPaused;
    if (this.isPaused && !prevIsPaused) {
      this.sendScores();
    }
  }

  private onPause() {
    const prevIsPaused = this.isPaused;
    if (this.gameOver) return;
    this.isPaused = true;
    if (!prevIsPaused) {
      this.sendScores();
    }
  }

  private onGameOver() {
    this.gameOver = true;
    this.sendScores();
  }

  private async sendScores() {
    const { callback_url, ...params } = this.callbackParams;
    if (!callback_url) return;

    fetch(callback_url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...params,
        history: this.history,
        score: this.score,
        time: Date.now(),
        key: await sha256(JSON.stringify(this.history)),
      }),
    });
  }

  private onScore(e: CustomEvent<{ lines: number; map: number[][]; }>) {
    const lines: number = e.detail.lines;
    const map: number[][] = e.detail.map;

    this.score += scoresForLine(lines, this.level);
    this.lines += lines;
    this.totalLines += lines;

    this.history.push({
      time: Date.now(),
      lines: lines,
      map: map,
      score: this.score,
      speed: this.speed,
      level: this.level,
    });

    if (this.lines >= linesToLevel(this.level)) {
      this.level += 1;
      this.lines = 0;
      this.speed = levelSpeed(this.level);
    }
  }

  private newShape() {
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
      this.newShape();
      if (!this.shape.canMove({ x: 0, y: 0})) {
        this.onGameOver();
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

    if (this.forceTick || timestamp - this.lastTickTime > this.speed) {
      this.forceTick = false
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
    this.linesDiv!.innerHTML = `Level: ${this.level}, Lines: ${this.totalLines}, Speed: ${this.speed.toFixed(3)}`;
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

const urlParams = new URLSearchParams(window.location.search);
const callbackParams: Record<string, string> = {};
const paramsKeys = ['callback_url', 'chat_id', 'message_id', 'inline_message_id', 'user_id'];

for(const key of paramsKeys) {
  if (urlParams.get(key)) {
    callbackParams[key] = urlParams.get(key) as string;
  }
}

let game = new Game(callbackParams);
