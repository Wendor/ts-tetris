export const linesToLevel = (level) => {
    return 10;
};
export const levelSpeed = (level) => {
    return (Math.pow(0.8 - level * 0.0007, level / 2)) * 1000;
};
export const scoresForLine = (lines, level) => {
    if (lines == 1)
        return 40 * (level + 1);
    if (lines == 2)
        return 100 * (level + 1);
    if (lines == 3)
        return 300 * (level + 1);
    if (lines == 4)
        return 1200 * (level + 1);
    return 0;
};
//# sourceMappingURL=Leveling.js.map