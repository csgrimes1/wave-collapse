'use strict';

module.exports = function curry (target, callback) {
    return function () {
        return callback.apply(null, [target].concat(Array.from(arguments)));
    };
};
