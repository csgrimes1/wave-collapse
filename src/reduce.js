'use strict';

const consume = require('./consume');

//reduceCallback (accum, currentValue, index) => newAccum
//reduceCallback can have a property postAccum, matching the signature
//   (accum, count) => alteredResult
function reduce (lazyIterable, reduceCallback, startAccum) {
    let accumulation = startAccum;
    return consume(lazyIterable, (value, index) => {
        accumulation = reduceCallback(accumulation, value, index);
        //Keep consuming.
        return true;
    })
        .then(count => {
            return reduceCallback.postAccum ? reduceCallback.postAccum(accumulation, count) : accumulation
        });
}

module.exports = reduce;
