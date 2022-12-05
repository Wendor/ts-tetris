import { Keyboard } from './inputs/Keyboard.js';
import { TouchInput } from './inputs/TouchInput.js';
export class GameInput extends EventTarget {
    keyboard;
    touch;
    events = [
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
        };
    }
}
//# sourceMappingURL=GameInput.js.map