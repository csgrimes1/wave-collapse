'use strict';

const stack0n = require('../src/stack0n');
const sinon = require('sinon');

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
            context.deepEqual(results.map(r => r.value), [2112, 2113, 2114]);
        },

        'async stacking': (context) => {
            const thenSpy = sinon.spy();
            const val = 2112;
            const series = createSeries(3);
            const results = Array.from(stack0n.transform(val, series, true));
            const p = Promise.all(results)
                .then(outputs => {
                    thenSpy();
                    context.deepEqual(outputs, [2112, 2113, 2114]);
                });
            context.ok(!thenSpy.called);
            return p;
        }
    }
};

