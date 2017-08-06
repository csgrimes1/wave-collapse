'use strict';

function sum (accum, currentValue) {
    const acc = typeof accum === 'number' ? accum : 0;
    return acc + currentValue;
}

const average = Object.assign(
    sum.bind(null),
    {
        postAccum: (total, itemCount) => {
            return 1.0 * Number(total) / itemCount;
        }
    }
);

function toArray (accum, currentValue) {
    return (accum || []).concat([currentValue]);
}

module.exports = {
    sum,
    average,
    toArray
};
