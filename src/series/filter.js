'use strict';

const serialLoop = require('./serial-loop');

module.exports = function (predicate) {
    return serialLoop.asIterator(this, predicate);
};
