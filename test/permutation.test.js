'use strict';

const permutation = require('../src/permutation');

module.exports = {
    beforeTest: t => {
        return t.createContext('permutation', 'permutation', null, 1000/*timeout/ms*/);
    },

    tests: {
        'typical permutation': context => {
            const ar1 = [1, 2], ar2 = ['a', 'b', 'c'], ar3 = [true, false];
            const p = permutation(ar1)
                .with(ar2)
                .with(ar3);
            const result = Array.from(p.visit());
            context.equal(ar1.length * ar2.length * ar3.length, result.length);
        },
        'zeroed permutation': context => {
            const ar1 = [1, 2], ar2 = ['a', 'b', 'c'], ar3 = [];
            const p = permutation(ar1)
                .with(ar2)
                .with(ar3);
            const result = Array.from(p.visit());
            context.equal(0, result.length);
        },
        'singular permutation': context => {
            const ar1 = [1, 2];
            const p = permutation(ar1);
            const result = Array.from(p.visit());
            context.deepEqual(result, [[1], [2]]);
        }
    }
};
