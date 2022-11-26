export class Keyboard extends EventTarget {
  constructor() {
    super();
    document.addEventListener('keydown', (e) => this.keydown(e));
  }

  private keydown(event: KeyboardEvent) {
    if (event.key == "ArrowRight") {
      this.dispatchEvent(new Event('moveRight'));
    }

    if (event.key == "ArrowLeft") {
      this.dispatchEvent(new Event('moveLeft'));
    }

    if (event.key == "ArrowUp") {
      this.dispatchEvent(new Event('rotate'));
    }

    if (event.key == "ArrowDown") {
      this.dispatchEvent(new Event('moveDown'));
    }

    if (event.key == " ") {
      this.dispatchEvent(new Event('tooglePause'));
    }
  }
}
