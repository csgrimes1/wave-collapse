'use strict';

//const serialLoop = require('./serial-loop');

// module.exports = function forEach (callback) {
//     let count = 0;
//     const countingCallback = () => {
//         count++;
//     };
//
//     return serialLoop(this, countingCallback, () => true, callback)
//         .then(() => count);
// };

const pipe = require('pipe');
const cardXform = require('../cardinality-transformer');
const promiseTry = require('../promise-try');

module.exports = function forEach (callback) {
    const iterator = this;
    const actionCallback = (value, responseCodes) => {
        return promiseTry(() => value)
            .then(value => {
                if (!callback(value)) {
                    return responseCodes.breakLoop;
                }
                return cardXform(iterator, actionCallback);
            });
    };
};
