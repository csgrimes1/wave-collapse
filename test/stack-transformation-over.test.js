'use strict';

const stackx = require('../src/stack-transformation-over');
const sinon = require('sinon');

function createTransformer () {
    return function *(atomicValueMonad) {
        const parents = ['mom', 'dad'];
        for (const parent of parents) {
            yield atomicValueMonad.then(child => `${child}'s ${parent}`);
        }
    };
}

module.exports = {
    beforeTest: t => {
        return t.createContext('stack-transformation-over', 'stacking 0..n monad and iterating over', null, 1000/*timeout/ms*/);
    },

    tests: {
        'sync stacking': (context) => {
            const data = ['brother', 'sister'];
            const monadSeries = createTransformer();
            const results = Array.from(stackx(data, monadSeries));
            context.deepEqual(results.map(r => r.value), ['brother\'s mom', 'brother\'s dad', 'sister\'s mom', 'sister\'s dad']);
        },
        'async stacking': (context) => {
            const thenSpy = sinon.spy();
            const data = ['brother', 'sister'];
            const monadSeries = createTransformer();
            const results = Array.from(stackx(data, monadSeries, true));
            const p = Promise.all(results)
                .then(outputs => {
                    thenSpy();
                    context.deepEqual(outputs, ['brother\'s mom', 'brother\'s dad', 'sister\'s mom', 'sister\'s dad']);
                });
            context.ok(!thenSpy.called);
            return p;
        }
    }
};

