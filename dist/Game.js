import { Shape } from './Shape.js';
import { Grid } from './Grid.js';
import { CellType } from './types/CellType.js';
import { GameInput } from './GameInput.js';
import { SevenBag } from './generators/SevenBag.js';
import { Glass } from './Glass.js';
import { Tetramino } from './Tetramino.js';
export class Game {
    glass = new Glass('grid');
    hint = new Grid('hint', 4, 4);
    speed = 500;
    shape;
    hintShape;
    lastTickTime = 0;
    resetTickTime = false;
    statusDiv;
    scoreDiv;
    linesDiv;
    score = 0;
    lines = 0;
    gameOver = false;
    isPaused = false;
    tetraminoQueue = [];
    generator = new SevenBag();
    constructor() {
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
        this.resetTickTime = true;
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
        this.shape.moveDown();
        this.resetTickTime = true;
    }
    onTooglePause() {
        if (this.gameOver) {
            this.lines = 0;
            this.score = 0;
            this.glass = new Glass('grid');
            this.newTetramino();
            this.gameOver = false;
            this.isPaused = false;
            return;
        }
        ;
        this.isPaused = !this.isPaused;
    }
    onPause() {
        if (this.gameOver)
            return;
        this.isPaused = true;
    }
    onScore(e) {
        if (e.detail == 1)
            this.score += 100;
        if (e.detail == 2)
            this.score += 300;
        if (e.detail == 3)
            this.score += 700;
        if (e.detail == 4)
            this.score += 1500;
        this.lines += e.detail;
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
                this.gameOver = true;
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
        this.linesDiv.innerHTML = `Lines: ${this.lines}`;
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
let game = new Game();
//# sourceMappingURL=Game.js.map