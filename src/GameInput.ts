import { Grid } from './Grid';
import { Keyboard } from './inputs/Keyboard';
import { TouchInput } from './inputs/TouchInput';

export class GameInput extends EventTarget {
  private grid: Grid;
  private keyboard: Keyboard;
  private touch: TouchInput;
  private events = [
    'rotate',
    'moveLeft',
    'moveRight',
    'moveDown',
  ];

  constructor(grid: Grid) {
    super();
    this.grid = grid;
    this.keyboard = new Keyboard();
    this.touch = new TouchInput(this.grid);

    for (let input of [this.keyboard, this.touch]) {
      for (let event of this.events) {
        input.addEventListener(event, () => this.dispatchEvent(new Event(event)));
      }
    }
  }
}
