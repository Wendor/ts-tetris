export class Keyboard extends EventTarget {
  constructor() {
    super();
    document.addEventListener('keydown', (e) => this.keydown(e));
  }

  private keydown(event: KeyboardEvent) {
    if (event.code == "ArrowRight") {
      this.dispatchEvent(new Event('moveRight'));
    }

    if (event.code == "ArrowLeft") {
      this.dispatchEvent(new Event('moveLeft'));
    }

    if (event.code == "ArrowUp") {
      this.dispatchEvent(new Event('rotate'));
    }

    if (event.code == "ArrowDown") {
      this.dispatchEvent(new Event('moveDown'));
    }

    if (event.code == "Space") {
      this.dispatchEvent(new Event('tooglePause'));
    }

    if (event.code == "KeyR") {
      this.dispatchEvent(new Event('newGame'));
    }
  }
}
