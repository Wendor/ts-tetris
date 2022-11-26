import { Tetrominos } from '../data/Tetrominos.js';
import { arrayShuffle } from '../Helpers.js';
export class SevenBag {
    bag = [];
    get() {
        if (this.bag.length == 0) {
            this.bag = arrayShuffle(JSON.parse(JSON.stringify(Tetrominos)));
        }
        const tetramino = this.bag.shift();
        if (!tetramino)
            return Tetrominos[0];
        return tetramino;
    }
}
//# sourceMappingURL=SevenBag.js.map