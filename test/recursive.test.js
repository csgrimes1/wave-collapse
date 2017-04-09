'use strict';

const recursive = require('../src/recursive'),
    fib = function (n) {
        const fibDriver = recursive((x1, x2, depth, recurse) => {
            if (depth === n) {
                return x2;
            } else if (depth === 0) {
                return recurse(0, 1, 1);
            }

            return recurse(x2, x1 + x2, depth + 1);
        });

        return fibDriver(0, 0, 0);
    };

module.exports = {
    beforeTest: t => {
        return t.createContext('recursive', 'recursive');
    },

    tests: {
        'recursion algorithm': context => {
            context.equal(fib(0), 0, 'fib(0)');
            context.equal(fib(1), 1, 'fib(1)');
            context.equal(fib(2), 1, 'fib(2)');
            context.equal(fib(3), 2, 'fib(3)');
            context.equal(fib(4), 3, 'fib(4)');
            context.equal(fib(5), 5, 'fib(5)');
        }
    }
};
