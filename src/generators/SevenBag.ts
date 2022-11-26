import { Tetrominos } from '../data/Tetrominos';
import { arrayShuffle } from '../Helpers';

export class SevenBag {
  private bag: number[][][] = [];

  get() {
    if (this.bag.length == 0) {
      this.bag = arrayShuffle(JSON.parse(JSON.stringify(Tetrominos)));
    }
    const tetramino = this.bag.shift();
    if (!tetramino) return Tetrominos[0];
    return tetramino;
  }
}
