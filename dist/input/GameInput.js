import { Keyboard } from './Keyboard.js';
import { TouchInput } from './TouchInput.js';
export class GameInput extends EventTarget {
    grid;
    keyboard;
    touch;
    events = [
        'rotate',
        'moveLeft',
        'moveRight',
        'moveDown',
    ];
    constructor(grid) {
        super();
        this.grid = grid;
        this.keyboard = new Keyboard();
        this.touch = new TouchInput(this.grid);
        for (let input of [this.keyboard, this.touch]) {
            for (let event of this.events) {
                input.addEventListener(event, (e) => this.dispatchEvent(new Event(event)));
            }
        }
    }
}
//# sourceMappingURL=GameInput.js.map