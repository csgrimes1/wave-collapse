'use strict';

const takeWhile = require('./take').takeWhile,
    bluebird = require('bluebird');

module.exports = function synchronousForEach (callback) {
    return bluebird.try(() => {
        const iterator = takeWhile.call(this, callback);
        let count = 0;

        for (const _ of iterator) { //eslint-disable-line
            count++;
        }

        return count;
    });
};

