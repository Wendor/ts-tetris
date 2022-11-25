import { Shape } from './Shape.js';
import { Grid } from './Grid.js';
export class Game {
    grid = new Grid();
    speed = 500;
    shape = new Shape(this.grid);
    nextShape = new Shape(this.grid);
    lastTickTime = 0;
    gameOver = false;
    constructor() {
        this.initControls();
        window.requestAnimationFrame((t) => this.update(t));
    }
    initControls() {
        let touchstartX = 0;
        let touchendX = 0;
        let touchstartY = 0;
        let touchendY = 0;
        document.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
            touchstartY = e.changedTouches[0].screenY;
        });
        document.addEventListener('touchend', e => {
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
                this.shape.move({ x: -1, y: 0 });
                return;
            }
            if (!vertical && xDiff > 0) {
                this.shape.move({ x: 1, y: 0 });
                return;
            }
            if (vertical && yDiff > 0) {
                this.shape.moveDown();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key == "ArrowRight") {
                this.shape.move({ x: 1, y: 0 });
            }
            if (event.key == "ArrowLeft") {
                this.shape.move({ x: -1, y: 0 });
            }
            if (event.key == "ArrowUp") {
                this.shape.rotate();
            }
            if (event.key == "ArrowDown") {
                this.shape.moveDown();
            }
        });
    }
    tick() {
        if (this.gameOver) {
            return;
        }
        if (!this.shape.canMove({ x: 0, y: 1 })) {
            this.shape.draw(2);
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