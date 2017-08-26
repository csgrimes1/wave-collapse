'use strict';

const generators = require('./generators');
const completionMonad = require('../src/completion-monad');
const reduce = require('../src/reduce');
const sinon = require('sinon');

module.exports = {
    beforeTest: t => {
        return t.createContext('reduce', 'reduce implementation');
    },

    tests: {
        'synchronous reduce': (context) => {
            const count = 8;
            const iterable = generators.syncgen(count, thing => completionMonad.resolve(thing));
            return reduce(iterable, (accum, currentValue, index) => {
                context.equal(currentValue, index);
                return accum.concat([currentValue]);
            }, [])
                .then(result => {
                    context.deepEqual(result, [0, 1, 2, 3, 4, 5, 6, 7]);
                });
        },
        'asynchronous reduce': (context) => {
            const count = 6;
            const iterable = generators.asyncgen(count, thing => completionMonad.resolve(thing));
            return reduce(iterable, (accum, currentValue, index) => {
                context.equal(currentValue, index);
                return accum.concat([currentValue]);
            }, [])
                .then(result => {
                    context.deepEqual(result, [0, 1, 2, 3, 4, 5]);
                });
        },
        'bad callback parameter should cause exception': (context) => {
            const errSpy = sinon.spy();
            try {
                const count = 6;
                const iterable = generators.asyncgen(count, thing => completionMonad.resolve(thing));
                return reduce(iterable, 'not a function');
            } catch (x) {
                errSpy();
            }
            context.ok(errSpy.called);
        }
    }
};
