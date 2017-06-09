'use strict';

const loop = require('../src/loop');
const completionMonad = require('../src/completion-monad');

module.exports = {
    beforeTest: t => {
        return t.createContext('loop', 'loops supporting synchronous and asynchronous repetition', null, 1000/*timeout/ms*/);
    },

    tests: {
        'simple loop': context => {
            const stopAt = 10;
            const callback = (context) => {
                return context.value >= stopAt
                    ? context.breakLoop(context.value)
                    : context.continueLoop(context.value + 1);
            };
            const result = loop(0, callback);
            context.equal(result.value, stopAt);
            context.ok(result instanceof completionMonad.classType);
        },
        'async loop': context => {
            const stopAt = 5;
            return loop(0, (context) => {
                const newValue = context.value + 1;
                if (newValue > stopAt) {
                    return context.breakLoop();
                } else if (newValue % 2 === 1) {
                    return context.continueAsyncLoop(Promise.resolve(newValue));
                }
                return context.continueLoop(newValue);
            })
                .then(result => {
                    context.equal(result, stopAt);
                });
        },
        'nested sync loop': context => {
            const nestAt = 10;
            const unnestAt = 120;
            const completeAt = 130;
            const callback = (context) => {
                if (context.value === unnestAt) {
                    return context.breakLoop(context.value + 1);
                }
                if (context.value >= completeAt) {
                    return context.breakLoop(context.value);
                }
                return context.value === nestAt
                    ? context.startInnerLoop(context.value + 100)
                    : context.continueLoop(context.value + 1);
            };
            const result = loop(0, callback);
            context.equal(result.value, completeAt);
            context.ok(result instanceof completionMonad.classType);
        }
    }
};
