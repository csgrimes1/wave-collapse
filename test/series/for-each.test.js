'use strict';

const iterate = require('../../src/iterate'),
    sinon = require('sinon'),
    generator = require('./promise-iterable');

module.exports = {
    beforeTest: t => {
        return t.createContext('async for-each', 'async forEach iteration', null, 2000/*timeout/ms*/);
    },

    tests: {
        'should iterate each item and resolve to a promise': context => {
            const spy = sinon.spy(),
                taken = 5;

            return iterate(generator(taken))
                .series()
                .forEach((value, index) => {
                    context.equal(value, index + 1, 'check value of each');
                    spy();
                    return true;
                })
                .then((count) => {
                    context.equal(count, taken, 'expect count to be number of elements in iteration');
                    context.equal(spy.callCount, taken);
                });
        },
        'should reject on a callback error': context => {
            const errorSpy = sinon.spy();

            return iterate(generator(100))
                .series()
                .forEach((value, index) => {
                    if (index > 0) {
                        throw new Error();
                    }
                    return true;
                })
                .then(() => {
                    context.ok(false);
                })
                .catch(() => {
                    context.ok(true);
                    errorSpy();
                })
                .then(() => {
                    context.ok(errorSpy.called);
                })
        }
    }
};
