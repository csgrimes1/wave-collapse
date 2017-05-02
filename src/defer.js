'use strict';

module.exports = function defer () {
    let _reject, _resolve;
    const promise = new Promise((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
    });

    return {
        promise,
        resolve: _resolve,
        reject: _reject
    };
};
