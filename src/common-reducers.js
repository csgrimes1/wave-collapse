'use strict';

const instructions = require('./instructions');

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

const count = Object.assign((accum) => {
        return (accum || 0) + 1;
    },
    {
        postAccum: (result) => result || 0
    });

const toArray = Object.assign((accum, currentValue) => {
        return (accum || []).concat([currentValue]);
    },
    {
        postAccum: (result) => result || []
    });

function visit (visitorCallback) {
    return (accum, currentValue, index) => {
        return visitorCallback(currentValue, index) ? true : instructions.STOP;
    };
}

module.exports = {
    sum,
    average,
    count,
    toArray,
    visit
};
