'use strict';

/*eslint-disable one-var-declaration-per-line*/

const permutation = require('../src/permutation'),
    commonReducers = require('../src/common-reducers');

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
            return p
                .reduce(commonReducers.toArray)
                .then(result => {
                    context.equal(ar1.length * ar2.length * ar3.length, result.length);
                });
        },
        'zeroed permutation': context => {
            const ar1 = [1, 2], ar2 = ['a', 'b', 'c'], ar3 = [];
            const p = permutation(ar1)
                .with(ar2)
                .with(ar3);
            return p
                .reduce(commonReducers.toArray)
                .then(result => {
                    context.equal(0, result.length);
                });
        },
        'singular permutation': context => {
            const ar1 = [1, 2];
            const p = permutation(ar1);
            return p
                .reduce(commonReducers.toArray)
                .then(result => {
                    context.deepEqual(result, [[1], [2]]);
                });
        },
        'filter on permutation': context => {
            const ar1 = [1, 2], ar2 = ['a', 'b', 'c'], ar3 = [true, false],
                p = permutation(ar1)
                    .with(ar2)
                    .filter((num, char) => char === 'b')
                    .with(ar3);
            return p
                .reduce(commonReducers.toArray)
                .then(results => {
                    context.equal(results.length, 4);
                    context.deepEqual(results, [
                        [1, 'b', true],
                        [1, 'b', false],
                        [2, 'b', true],
                        [2, 'b', false]
                    ]);
                });
        }
    }
};
