'use strict';

const defer = require('../defer');

module.exports = () => {
    let deferred = defer();
    deferred.resolve();
    const waitOn = (item) => {
        return deferred.promise
            .then(() => {
                deferred = defer();
                return Promise.resolve(item);
            })
            .then(result => {
                deferred.resolve();
                return [result];
            });
    };

    return {

        transformIteration: (collection) => {
            const innerIterator = collection[Symbol.iterator]();

            const iteration = {
                [Symbol.iterator]: () => iteration,
                next: () => {
                    const item = innerIterator.next();

                    if (item.breakLoop) {
                        return item;
                    }
                    return waitOn(item);
                }
            };
        }
    };
};
