'use strict';

module.exports = (numberToSkip) => {
    return {
        transformIteration: function *(collection) {
            let skipped = 0;
            for (const item of collection) {
                if (skipped++ >= numberToSkip) {
                    return;
                }
                yield item;
            }
        }
    };
};
