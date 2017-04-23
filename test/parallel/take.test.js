'use strict';

const iterate = require('../../src/iterate'),
    syncGenerator = require('../sync-generator'),
    sinon = require('sinon');

process.on('uncaughtException', (x) => {
    console.error(`bad: ${x}`); //eslint-disable-line
});
process.on('unhandledRejection', (x) => {
    console.error(`promise: ${x}`); //eslint-disable-line
});

module.exports = {
    beforeTest: t => {
        return t.createContext('take', 'iterator.take', null, 2000/*timeout/ms*/);
    },

    tests: {
        'synchronous take test': context => {
            const synchronousSpy = sinon.spy();

            iterate(syncGenerator())
                .take(5)
                .forEach(() => {
                    synchronousSpy();

                    return true;
                });
            context.equal(synchronousSpy.callCount, 5, 'ran synchronously');
        },
        'take should iterate first n elements': context => {
            return iterate([1, 2, 3, 4, 5, 6, 7])
                .take(5)
                .gather()
                .then(result => {
                    context.deepEqual(result, [1, 2, 3, 4, 5]);
                });
        },
        'takeWhile should follow predicate': context => {
            return iterate([1, 2, 3, 4, 5, 6, 7])
                .takeWhile(n => n < 7)
                .gather()
                .then(result => {
                    context.deepEqual(result, [1, 2, 3, 4, 5, 6]);
                });
        },
        'takeWhile should respect the end of the source': context => {
            return iterate([1, 2, 3, 4, 5, 6, 7])
                .takeWhile(n => n < 5150)
                .gather()
                .then(result => {
                    context.deepEqual(result, [1, 2, 3, 4, 5, 6, 7]);
                });
        }
    }
};
