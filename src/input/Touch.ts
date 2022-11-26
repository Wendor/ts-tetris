import { Grid } from "../Grid";

export class Touch extends EventTarget {
  private grid: Grid;
  private touchstartX = 0;
  private touchendX = 0;
  private touchstartY = 0;
  private touchendY = 0;
  private isMoving = false;

  constructor(grid: Grid) {
    super();
    this.grid = grid;
    document.addEventListener('touchstart', (e) => this.touchStart(e))
    document.addEventListener('touchend', (e) => this.touchEnd(e));
    document.addEventListener('touchmove', (e) => this.touchMove(e));
  }

  private touchStart(e: TouchEvent) {
    this.touchstartX = e.changedTouches[0].screenX;
    this.touchstartY = e.changedTouches[0].screenY;
    this.isMoving = false;
  }

  private touchEnd(e: TouchEvent) {
    if (!this.isMoving) {
      this.dispatchEvent(new Event('rotate'));
      return;
    }
  }

  private touchMove(e: TouchEvent) {
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
