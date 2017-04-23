'use strict';

const iterate = require('../../src/iterate'),
    sinon = require('sinon');

module.exports = {
    beforeTest: t => {
        return t.createContext('for-each', 'forEach iteration to promise on completion', null, 2000/*timeout/ms*/);
    },

    tests: {
        'should iterate each item and resolve to a promise': context => {
            const ar = [1, 2, 3, 4, 5],
                spy = sinon.spy();

            return iterate(ar)
                .forEach((value, index) => {
                    context.equal(value, index + 1, 'check value of each');
                    spy();
                    return true;
                })
                .then((count) => {
                    context.equal(count, ar.length, 'expect count to be number of elements in original array');
                    context.equal(spy.callCount, ar.length);
                });
        },
        'should reject on a callback error': context => {
            const ar = [1, 2, 3, 4, 5];

            return iterate(ar)
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
                });
        }
    }
};
