'use strict';

const stack0n = require('../src/stack0n');
const sinon = require('sinon');
const completionMonad = require('../src/completion-monad');

function createSeries (length) {
    return function *(atomicValueMonad) {
        for (let i = 0; i < length; i++) {
            yield atomicValueMonad.then(atom => atom + i);
        }
    };
}

module.exports = {
    beforeTest: t => {
        return t.createContext('stack0n', 'stacking 0..n monad operations', null, 1000/*timeout/ms*/);
    },

    tests: {
        'simple stacking': (context) => {
            const val = 2112;
            const series = createSeries(3);
            const results = Array.from(stack0n.transform(val, series));
            context.ok(results[0] instanceof completionMonad.classType, 'should yield sync monad');
            context.deepEqual(results.map(r => r.value), [2112, 2113, 2114]);
        },

        'async stacking': (context) => {
            const thenSpy = sinon.spy();
            const val = Promise.resolve(2112);
            const series = createSeries(3);
            const results = Array.from(stack0n.transform(val, series));
            const p = Promise.all(results)
                .then(outputs => {
                    thenSpy();
                    context.deepEqual(outputs, [2112, 2113, 2114]);
                });
            context.ok(results[0] instanceof Promise, 'should yield promise');
            context.ok(!thenSpy.called);
            return p;
        }
    }
};

