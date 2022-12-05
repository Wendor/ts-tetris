import { Keyboard } from './inputs/Keyboard';
import { TouchInput } from './inputs/TouchInput';

export class GameInput extends EventTarget {
  private keyboard: Keyboard;
  private touch: TouchInput;
  private events = [
    'rotate',
    'moveLeft',
    'moveRight',
    'moveDown',
    'tooglePause',
    'pause',
    'newGame',
  ];

  constructor() {
    super();
    this.keyboard = new Keyboard();
    this.touch = new TouchInput();

    for (let input of [this.keyboard, this.touch]) {
      for (let event of this.events) {
        input.addEventListener(event, () => this.dispatchEvent(new Event(event)));
      }
    }

    window.onblur = () => {
      this.dispatchEvent(new Event('pause'));
    }
  }
}
