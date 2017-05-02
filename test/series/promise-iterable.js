'use strict';

module.exports = function *(limit = 10000000) {
    for (let num = 0; num < limit; num++) {
        yield Promise.resolve(num + 1);
    }
};
