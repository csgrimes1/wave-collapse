'use strict';

/*eslint-disable one-var-declaration-per-line*/

const combination = require('../src/combination'),
    commonReducers = require('../src/common-reducers');

module.exports = {
    beforeTest: t => {
        return t.createContext('combination', 'combination', null, 1000/*timeout/ms*/);
    },

    tests: {
        'typical combination': context => {
            const ar1 = [1, 2], ar2 = ['a', 'b', 'c'], ar3 = [true, false];
            const p = combination(ar1)
                .with(ar2)
                .with(ar3);
            return p
                .reduce(commonReducers.toArray)
                .then(result => {
                    context.equal(ar1.length * ar2.length * ar3.length, result.length);
                });
        },
        'zeroed combination': context => {
            const ar1 = [1, 2], ar2 = ['a', 'b', 'c'], ar3 = [];
            const p = combination(ar1)
                .with(ar2)
                .with(ar3);
            return p
                .reduce(commonReducers.toArray)
                .then(result => {
                    context.equal(0, result.length);
                });
        },
        'singular combination': context => {
            const ar1 = [1, 2];
            const p = combination(ar1);
            return p
                .reduce(commonReducers.toArray)
                .then(result => {
                    context.deepEqual(result, [[1], [2]]);
                });
        },
        'filter on combination': context => {
            const ar1 = [1, 2], ar2 = ['a', 'b', 'c'], ar3 = [true, false],
                p = combination(ar1)
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
