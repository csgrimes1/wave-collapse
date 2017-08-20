'use strict';

/*eslint-disable one-var-declaration-per-line*/

const permutation = require('../src/permutation'),
    commonReducers = require('../src/common-reducers');

module.exports = {
    beforeTest: t => {
        return t.createContext('permutation', 'permutation', null, 1000/*timeout/ms*/);
    },

    tests: {
        'skip!typical permutation': context => {
            const ar1 = [1, 2], ar2 = ['a', 'b', 'c'], ar3 = [true, false];
            const p = permutation(ar1)
                .with(ar2)
                .with(ar3);
            return p.iterateOver()
                .reduce(commonReducers.toArray)
                .then(result => {
                    context.equal(ar1.length * ar2.length * ar3.length, result.length);
                });
        },
        'skip!zeroed permutation': context => {
            const ar1 = [1, 2], ar2 = ['a', 'b', 'c'], ar3 = [];
            const p = permutation(ar1)
                .with(ar2)
                .with(ar3);
            return p.iterateOver()
                .reduce(commonReducers.toArray())
                .then(result => {
                    context.equal(0, result.length);
                });
        },
        'singular permutation': context => {
            const ar1 = [1, 2];
            const p = permutation(ar1);
            return p.iterateOver()
                .reduce(commonReducers.toArray)
                .then(result => {
                    context.deepEqual(result, [[1], [2]]);
                });
        },
        'skip!filter on permutation': context => {
            const ar1 = [1, 2], ar2 = ['a', 'b', 'c'], ar3 = [true, false],
                p = permutation(ar1)
                    .with(ar2)
                    .filter((num, char) => char === 'b')
                    .with(ar3);
            return p.iterateOver()
                .reduce(commonReducers.toArray())
                .then(results => {
                    context.equal(results.length, 4);
                });
        }
    }
};
