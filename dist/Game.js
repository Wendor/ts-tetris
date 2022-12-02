import { Shape } from './Shape.js';
import { Grid } from './Grid.js';
import { CellType } from './types/CellType.js';
import { GameInput } from './GameInput.js';
import { SevenBag } from './generators/SevenBag.js';
import { Glass } from './Glass.js';
import { Tetramino } from './Tetramino.js';
import { levelSpeed, linesToLevel, scoresForLine } from './Leveling.js';
export class Game {
    callbackParams;
    glass = new Glass('grid', 10, 22, 1);
    hint = new Grid('hint', 4, 4);
    shape;
    hintShape;
    lastTickTime = 0;
    resetTickTime = false;
    forceTick = false;
    statusDiv;
    scoreDiv;
    linesDiv;
    score = 0;
    totalLines = 0;
    lines = 0;
    level = 0;
    speed = levelSpeed(0);
    gameOver = false;
    isPaused = false;
    tetraminoQueue = [];
    generator = new SevenBag();
    constructor(callbackParams = {}) {
        this.callbackParams = callbackParams;
        this.shape = new Shape(this.glass, this.generator.get());
        this.tetraminoQueue = (new Array(4))
            .fill([])
            .map(() => this.generator.get());
        this.hintShape = new Tetramino(this.hint, this.tetraminoQueue[0], 'middle');
        this.initInput();
        this.glass.addEventListener('score', (e) => this.onScore(e));
        this.statusDiv = document.getElementById('status');
        this.scoreDiv = document.getElementById('score');
        this.linesDiv = document.getElementById('lines');
        window.requestAnimationFrame((t) => this.update(t));
    }
    initInput() {
        const input = new GameInput();
        input.addEventListener('rotate', () => this.onRotate());
        input.addEventListener('moveLeft', () => this.onMoveLeft());
        input.addEventListener('moveRight', () => this.onMoveRight());
        input.addEventListener('moveDown', () => this.onMoveDown());
        input.addEventListener('tooglePause', () => this.onTooglePause());
        input.addEventListener('pause', () => this.onPause());
    }
    onRotate() {
        if (this.gameOver || this.isPaused)
            return;
        this.shape.rotate();
        if (this.shape.canMove({ x: 0, y: 1 })) {
            this.resetTickTime = true;
        }
    }
    onMoveLeft() {
        if (this.gameOver || this.isPaused)
            return;
        this.shape.move({ x: -1, y: 0 });
    }
    onMoveRight() {
        if (this.gameOver || this.isPaused)
            return;
        this.shape.move({ x: 1, y: 0 });
    }
    onMoveDown() {
        if (this.gameOver || this.isPaused)
            return;
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
    onTooglePause() {
        if (this.gameOver) {
            this.totalLines = 0;
            this.lines = 0;
            this.score = 0;
            this.level = 0;
            this.glass = new Glass('grid');
            this.glass.addEventListener('score', (e) => this.onScore(e));
            this.newTetramino();
            this.gameOver = false;
            this.isPaused = false;
            return;
        }
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.sendScores();
        }
    }
    onPause() {
        if (this.gameOver)
            return;
        this.isPaused = true;
        this.sendScores();
    }
    onGameOver() {
        this.gameOver = true;
        this.sendScores();
    }
    sendScores() {
        const { callback_url, ...params } = this.callbackParams;
        if (!callback_url)
            return;
        fetch(callback_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...params,
                score: this.score,
            }),
        });
    }
    onScore(e) {
        const lines = e.detail;
        this.score += scoresForLine(lines, this.level);
        this.lines += lines;
        this.totalLines += lines;
        if (this.lines >= linesToLevel(this.level)) {
            this.level += 1;
            this.lines = 0;
            this.speed = levelSpeed(this.level);
        }
    }
    newTetramino() {
        const tetramino = this.tetraminoQueue.shift();
        if (!tetramino)
            throw new Error('unknown error');
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
    tick() {
        if (this.gameOver || this.isPaused) {
            return;
        }
        if (!this.shape.canMove({ x: 0, y: 1 })) {
            this.newTetramino();
            if (!this.shape.canMove({ x: 0, y: 0 })) {
                this.onGameOver();
            }
            this.shape.draw();
            this.hintShape.draw();
        }
        this.shape.tick();
        this.glass.hideLines();
    }
    update(timestamp) {
        if (this.resetTickTime) {
            this.lastTickTime = timestamp;
            this.resetTickTime = false;
        }
        if (this.forceTick || timestamp - this.lastTickTime > this.speed) {
            this.forceTick = false;
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
    updateTexts() {
        if (this.gameOver || this.isPaused) {
            this.glass.grid.classList.add('paused');
            this.hint.grid.classList.add('paused');
        }
        else {
            this.glass.grid.classList.remove('paused');
            this.hint.grid.classList.remove('paused');
        }
        this.scoreDiv.innerHTML = `Score: ${this.score}`;
        this.linesDiv.innerHTML = `Level: ${this.level}, Lines: ${this.totalLines}, Speed: ${this.speed.toFixed(3)}`;
        if (this.gameOver) {
            this.statusDiv.innerHTML = 'game over';
            return;
        }
        if (this.isPaused) {
            this.statusDiv.innerHTML = 'paused';
            return;
        }
        this.statusDiv.innerHTML = 'playing';
    }
}
const urlParams = new URLSearchParams(window.location.search);
const callbackParams = {};
const paramsKeys = ['callback_url', 'chat_id', 'message_id', 'inline_message_id', 'user_id'];
for (const key of paramsKeys) {
    if (urlParams.get(key)) {
        callbackParams[key] = urlParams.get(key);
    }
}
let game = new Game(callbackParams);
//# sourceMappingURL=Game.js.map