export const arrayShuffle = (arr) => {
    const newArr = arr.slice();
    for (let i = newArr.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr;
};
export const sha256 = async (text) => {
    const textAsBuffer = new TextEncoder().encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', textAsBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const digest = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return digest;
};
//# sourceMappingURL=Helpers.js.map