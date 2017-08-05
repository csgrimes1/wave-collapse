'use strict';

const consume = require('./consume');

//reduceCallback (accum, currentValue, index) => newAccum
function reduce (lazyIterable, reduceCallback, startAccum) {
    let accumulation = startAccum;
    return consume(lazyIterable, (value, index) => {
        accumulation = reduceCallback(accumulation, value, index);
        //Keep consuming.
        return true;
    })
        .then(() => accumulation);
}

module.exports = reduce;
