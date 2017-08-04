'use strict';

const standardTransforms = require('../src/standard-transforms');
const instructions = require('../src/instructions');

module.exports = {
    beforeTest: t => {
        return t.createContext('standard-transforms', 'standard transform operations');
    },

    tests: {
        'map transform': context => {
            const func = standardTransforms.map((val, index) => val + index);
            return Promise.all(func(Promise.resolve(10), 1))
                .then(results => {
                    context.equal(results[0], 11);
                });
        },
        'filter transform': context => {
            const func = standardTransforms.filter((val, index) => val === index);
            const promises = func(Promise.resolve(1), 1)
                .concat(func(Promise.resolve(0), 2));
            return Promise.all(promises)
                .then(results => {
                    context.deepEqual(results, [1, instructions.SKIP]);
                });
        },
        'skip transform': context => {
            const func = standardTransforms.skip(2);
            const promises = func(Promise.resolve(0), 0)
                .concat(func(Promise.resolve(1), 1))
                .concat(func(Promise.resolve(2), 2))
                .concat(func(Promise.resolve(3), 3));
            return Promise.all(promises)
                .then(results => {
                    context.deepEqual(results, [instructions.SKIP, instructions.SKIP, 2, 3]);
                });
        },
        'skipWhile transform': context => {
            const func = standardTransforms.skipWhile(val => val < 1);
            const promises = func(Promise.resolve(0), 0)
                .concat(func(Promise.resolve(1), 1))
                .concat(func(Promise.resolve(2), 2))
                .concat(func(Promise.resolve(3), 3));
            return Promise.all(promises)
                .then(results => {
                    context.deepEqual(results, [instructions.SKIP, 1, 2, 3]);
                });
        },
        'take transform': context => {
            const func = standardTransforms.take(3);
            const promises = func(Promise.resolve(0), 0)
                .concat(func(Promise.resolve(1), 1))
                .concat(func(Promise.resolve(2), 2))
                .concat(func(Promise.resolve(3), 3));
            return Promise.all(promises)
                .then(results => {
                    context.deepEqual(results, [0, 1, 2, instructions.STOP]);
                });
        },
        'takeWhile transform': context => {
            const func = standardTransforms.takeWhile((val, index) => index < 2);
            const promises = func(Promise.resolve(0), 0)
                .concat(func(Promise.resolve(1), 1))
                .concat(func(Promise.resolve(2), 2))
                .concat(func(Promise.resolve(3), 3));
            return Promise.all(promises)
                .then(results => {
                    context.deepEqual(results, [0, 1, instructions.STOP, instructions.STOP]);
                });
        },
        'flatMap transform': context => {
            const func = standardTransforms.flatMap();
            const promises = func([])
                .concat(func(['a', 'b']))
                .concat(func(['c']))
                .concat(func(['d', 'e', ['f', 'h']]));
            return Promise.all(promises)
                .then(results => {
                    context.deepEqual(results, ['a', 'b', 'c', 'd', 'e', ['f', 'h']]);
                });
        }
    }
};
