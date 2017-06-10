'use strict';

const consume = require('../src/consume');
const generators = require('./generators');

module.exports = {
    beforeTest: t => {
        return t.createContext('shortname', 'long description', null, 1000/*timeout/ms*/);
    },

    tests: {
        'should consume a synchronous iterator': context => {
            const count = 5;
            return consume(generators.syncgen(count), () => true)
                .then(finalCount => {
                    context.equal(finalCount, count);
                });
        },
        'should consume an asynchronous iterator': context => {
            const count = 5;
            return consume(generators.asyncgen(count), () => true)
                .then(finalCount => {
                    context.equal(finalCount, count);
                });
        },
        'should stop a synchronous iterator': context => {
            const count = 5,
                stopVal = 3;
            return consume(generators.syncgen(count), (val) => val < stopVal)
                .then(finalCount => {
                    context.equal(finalCount, stopVal);
                });
        },
        'should stop an asynchronous iterator': context => {
            const count = 5,
                stopVal = 3;
            return consume(generators.asyncgen(count), (val) => val < stopVal)
                .then(finalCount => {
                    context.equal(finalCount, stopVal);
                });
        }
    }
};
