'use strict';

const iterate = require('../src/iterate');

module.exports = function () {
    const producer = function *() {
        for (let num = 1; num > 0; num++) {
            yield num;
        }
    };

    return iterate(producer());
};
