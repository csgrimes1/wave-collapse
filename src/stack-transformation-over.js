'use strict';

const stack0n = require('./stack0n');
const instructions = require('./instructions');

function *stackTransformationOver (iterable, transformation) {
    //Wrap transformation so that it can count calls directly.
    let count = 0;
    const xform2 = (val) => {
        if (instructions.shouldSkip(val))
            return [];
        return transformation(val, count++);
    };
    for (const atom of iterable) {
        yield* stack0n.transform(atom, xform2);
    }
}

module.exports = stackTransformationOver;
