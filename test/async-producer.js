'use strict';

const iterate = require('../src/iterate');

module.exports = function () {
    let num = 1;
    const producer = (callback) => {
        return new Promise(resolve => {
            setTimeout(() => {
                callback(num, num - 1, false);
                num++;
                resolve(num);
            }, 0);
        });
    };

    return iterate(producer);
};
