import { Shape } from './Shape.js';
import { Grid } from './Grid.js';
import { CellType } from './types/CellType.js';
import { Keyboard } from './input/Keyboard.js';
import { Touch } from './input/Touch.js';
export class Game {
    grid = new Grid();
    speed = 500;
    shape = new Shape(this.grid);
    nextShape = new Shape(this.grid);
    lastTickTime = 0;
    resetTickTime = false;
    gameOver = false;
    constructor() {
        this.initControls();
        window.requestAnimationFrame((t) => this.update(t));
    }
    initControls() {
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
    tick() {
        if (this.gameOver) {
            return;
        }
        if (!this.shape.canMove({ x: 0, y: 1 })) {
            this.shape.draw(CellType.wall);
            this.shape = this.nextShape;
            this.nextShape = new Shape(this.grid);
            if (!this.shape.canMove({ x: 0, y: 0 })) {
                this.gameOver = true;
            }
            this.shape.draw();
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
        this.grid.update();
        this.shape.update();
        window.requestAnimationFrame((t) => this.update(t));
    }
}
const game = new Game();
//# sourceMappingURL=Game.js.map