'use strict';

const stack0n = require('./stack0n');

function *stackTransformationOver (iterable, transformation, synchronous = true) {
    for (const atom of iterable) {
        yield* stack0n.transform(atom, transformation, synchronous);
    }
}

module.exports = stackTransformationOver;
