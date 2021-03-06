'use strict';

const consume = require('./consume');
const instructions = require('./instructions');

//reduceCallback (accum, currentValue, index) => newAccum
//reduceCallback can have a property postAccum, matching the signature
//   (accum, count) => alteredResult
function reduce (lazyIterable, reduceCallback, startAccum) {
    if (typeof reduceCallback !== 'function') {
        throw new Error('The reduceCallback parameter must be a function.');
    }
    let accumulation = startAccum;
    return consume(lazyIterable, (value, index) => {
        accumulation = reduceCallback(accumulation, value, index);
        if (accumulation === instructions.STOP) {
            return false;
        }
        //Keep consuming.
        return true;
    })
        .then(count => {
            return reduceCallback.postAccum ? reduceCallback.postAccum(accumulation, count) : accumulation
        });
}

module.exports = reduce;
