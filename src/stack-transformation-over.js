'use strict';

const stack0n = require('./stack0n');

function *stackTransformationOver (iterable, transformation, asynchronous = false) {
    let index = 0;
    for (const atom of iterable) {
        yield* stack0n.transform(atom, index++, transformation, asynchronous);
    }
}

module.exports = stackTransformationOver;
