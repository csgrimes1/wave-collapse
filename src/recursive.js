'use strict';

//Substitute for tail recursion. Though supported in Ecma6, tail recursion
//is not implemented in V8.
//
//Advantage: the white box code allows certainty with regard to tail calls,
//never corner cases where recursion is stacked.
const restackUncurried = function (callback, finalArgs) {
        return () => {
            return callback.apply(null, finalArgs);
        };
    },
    recursive = function (target) {
        const restack = function () {
            return restackUncurried(target, Array.from(arguments).concat([restack]));
        };

        return function () {
            const target = this;
            let callback = () => restack.apply(target, Array.from(arguments));

            do {
                const result = callback();

                if (typeof result === 'function') {
                    callback = result;
                } else {
                    return result;
                }
            } while (true);
        };
    };

module.exports = recursive;
