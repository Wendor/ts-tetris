import { Shape } from './Shape.js';
import { Grid } from './Grid.js';
import { CellType } from './types/CellType.js';
import { GameInput } from './GameInput.js';
import { SevenBag } from './generators/SevenBag.js';
import { Glass } from './Glass.js';
import { Tetramino } from './Tetramino.js';
export class Game {
    grid = new Glass('grid');
    hint = new Grid('hint', 4, 4);
    speed = 500;
    shape;
    hintShape;
    lastTickTime = 0;
    resetTickTime = false;
    gameOver = false;
    tetraminoQueue = [];
    generator = new SevenBag();
    constructor() {
        this.shape = new Shape(this.grid, this.generator.get());
        this.tetraminoQueue = (new Array(4))
            .fill([])
            .map(() => this.generator.get());
        this.hintShape = new Tetramino(this.hint, this.tetraminoQueue[0], 'middle');
        this.initInput();
        window.requestAnimationFrame((t) => this.update(t));
    }
    initInput() {
        const input = new GameInput();
        input.addEventListener('rotate', () => this.onRotate());
        input.addEventListener('moveLeft', () => this.onMoveLeft());
        input.addEventListener('moveRight', () => this.onMoveRight());
        input.addEventListener('moveDown', () => this.onMoveDown());
    }
    onRotate() {
        if (this.gameOver)
            return;
        this.shape.rotate();
        this.resetTickTime = true;
    }
    onMoveLeft() {
        if (this.gameOver)
            return;
        this.shape.move({ x: -1, y: 0 });
    }
    onMoveRight() {
        if (this.gameOver)
            return;
        this.shape.move({ x: 1, y: 0 });
    }
    onMoveDown() {
        if (this.gameOver)
            return;
        this.shape.moveDown();
        this.resetTickTime = true;
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
        this.shape = new Shape(this.grid, tetramino);
        this.hintShape = new Tetramino(this.hint, this.tetraminoQueue[0], 'middle');
        this.tetraminoQueue.push(this.generator.get());
    }
    tick() {
        if (this.gameOver) {
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
        this.grid.hideRows();
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
        this.grid.update();
        this.hint.update();
        ;
        window.requestAnimationFrame((t) => this.update(t));
    }
}
const game = new Game();
//# sourceMappingURL=Game.js.map