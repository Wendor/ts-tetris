export class TouchInput extends EventTarget {
    touchstartX = 0;
    touchstartY = 0;
    isMoving = false;
    ignoreCurrent = false;
    step = 24;
    timeout = setTimeout(() => null, 0);
    constructor() {
        super();
        document.addEventListener('touchstart', (e) => this.touchStart(e));
        document.addEventListener('touchend', (e) => this.touchEnd(e));
        document.addEventListener('touchmove', (e) => this.touchMove(e));
        document.addEventListener('touchcancel', (e) => this.touchCancel(e));
    }
    touchStart(e) {
        e.preventDefault();
        this.ignoreCurrent = false;
        this.timeout = setTimeout(() => {
            if (!this.isMoving) {
                this.dispatchEvent(new Event('tooglePause'));
                this.ignoreCurrent = true;
            }
        }, 1000);
        const cell = document.querySelector('.cell');
        if (cell) {
            this.step = cell.clientWidth;
        }
        this.touchstartX = e.changedTouches[0].screenX;
        this.touchstartY = e.changedTouches[0].screenY;
        this.isMoving = false;
    }
    touchEnd(e) {
        e.preventDefault();
        clearTimeout(this.timeout);
        if (this.ignoreCurrent)
            return;
        if (!this.isMoving) {
            this.dispatchEvent(new Event('rotate'));
            return;
        }
    }
    touchCancel(e) {
        e.preventDefault();
        clearTimeout(this.timeout);
    }
    touchMove(e) {
        e.preventDefault();
        if (this.ignoreCurrent)
            return;
        const touchendX = e.changedTouches[0].screenX;
        const touchendY = e.changedTouches[0].screenY;
        const xDiff = touchendX - this.touchstartX;
        const yDiff = touchendY - this.touchstartY;
        const horisontal = Math.abs(yDiff) < Math.abs(xDiff);
        const diff = horisontal ? xDiff : yDiff;
        if (Math.abs(diff) < this.step) {
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