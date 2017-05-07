'use strict';

module.exports = function (callback) {
    return new Promise((resolve, reject) => {
        try {
            resolve(callback());
        } catch (x) {
            reject(x);
        }
    });
};
