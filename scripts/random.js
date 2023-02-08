export class Random {
    constructor() {

    }

    /**
     * 
     * @param {Number} int the maximum value (inclusive)
     * @returns a number between 0 and int
     */
    nextInt(int) {
        return this.randint(0, int);
    }

    /**
     * 
     * @param {Number} min 
     * @param {Number} max 
     * @returns a number >= min and <= max
     */
    randint(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
    
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}