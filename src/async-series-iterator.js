'use strict';

let defer = require('./defer');

module.exports = function (innerIterator) {
    if (innerIterator.done) {
        return {done: true};
    }

    let current = innerIterator.next();
    let gate = defer();
    gate.resolve(current.value);
    return {
        next: () => {
            return;
        }
    };
};

