'use strict';

module.exports = () => {
    let skipped = -1;

    return (item, index, numberToSkip) => {
        skipped += 1;
        if (skipped >= numberToSkip) {
            return [item];
        } else {
            return [];
        }
    };
};
