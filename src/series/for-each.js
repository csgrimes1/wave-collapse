'use strict';

const serialLoop = require('./serial-loop');

module.exports = function forEach (callback) {
    let count = 0;
    const countingCallback = () => {
        count++;
    };

    return serialLoop(this, countingCallback, () => true, callback)
        .then(() => count);
};
