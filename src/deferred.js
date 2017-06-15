'use strict';

module.exports = function () {
    let resolve, reject;
    const p = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    return {
        promise: p,
        resolve,
        reject
    };
};
