'use strict';

module.exports = (predicate) => {
    return {
        transformIteration: function (collection) {
            const innerIterator = collection[Symbol.iterator]();
            let index = 0;
            let skipping = true;

            const iteration = {
                [Symbol.iterator]: () => iteration,
                next: () => {
                    const item = innerIterator.next();

                    if (item.breakLoop || !skipping) {
                        return item;
                    }
                    skipping = predicate(item.value, index);
                    if (skipping) {
                        return iteration.next();
                    }
                    return item;
                }
            };
        }
    };
};
