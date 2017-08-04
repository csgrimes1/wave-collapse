'use strict';

const stack0n = require('./stack0n');

function *stackTransformationOver (iterable, transformation) {
    let index = 0;
    for (const atom of iterable) {
        yield* stack0n.transform(atom, index++, transformation);
    }
}

module.exports = stackTransformationOver;
