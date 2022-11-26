export class TouchInput extends EventTarget {
    grid;
    touchstartX = 0;
    touchstartY = 0;
    isMoving = false;
    constructor(grid) {
        super();
        this.grid = grid;
        document.addEventListener('touchstart', (e) => this.touchStart(e));
        document.addEventListener('touchend', (e) => this.touchEnd(e));
        document.addEventListener('touchmove', (e) => this.touchMove(e));
    }
    touchStart(e) {
        this.touchstartX = e.changedTouches[0].screenX;
        this.touchstartY = e.changedTouches[0].screenY;
        this.isMoving = false;
    }
    touchEnd(e) {
        if (!this.isMoving) {
            this.dispatchEvent(new Event('rotate'));
            return;
        }
    }
    touchMove(e) {
        const touchendX = e.changedTouches[0].screenX;
        const touchendY = e.changedTouches[0].screenY;
        const xDiff = touchendX - this.touchstartX;
        const yDiff = touchendY - this.touchstartY;
        const horisontal = Math.abs(yDiff) < Math.abs(xDiff);
        const diff = horisontal ? xDiff : yDiff;
        if (Math.abs(diff) < this.grid.blockSize) {
            return;
        }
        if (!this.isMoving && !horisontal && yDiff > 0) {
            this.dispatchEvent(new Event('moveDown'));
            this.isMoving = true;
            return;
        }
        this.isMoving = true;
        if (horisontal && xDiff < 0) {
            this.dispatchEvent(new Event('moveLeft'));
        }
        if (horisontal && xDiff > 0) {
            this.dispatchEvent(new Event('moveRight'));
        }
        this.touchstartX = touchendX;
        this.touchstartY = touchendY;
    }
}
//# sourceMappingURL=TouchInput.js.map