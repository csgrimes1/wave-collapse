'use strict';

const iterate = require('../../src/iterate'),
    sinon = require('sinon');

module.exports = {
    beforeTest: t => {
        return t.createContext('skip', 'iterator.take', null, 2000/*timeout/ms*/);
    },

    tests: {
        'synchronous skip test': context => {
            const synchronousSpy = sinon.spy();

            iterate([11, 12, 13, 14, 15, 16, 17, 18])
                .skip(3)
                .forEach(() => {
                    synchronousSpy();
                    return true;
                });
                context.equal(synchronousSpy.callCount, 5, 'ran synchronously');
        },
        'skip should pass over first n elements': context => {
            return iterate([1, 2, 3, 4, 5, 6, 7])
                .skip(2)
                .gather()
                .then(result => {
                    context.deepEqual(result, [3, 4, 5, 6, 7]);
                });
        },
        'skipWhile should follow predicate': context => {
            return iterate([1, 2, 3, 4, 5, 6, 7])
                .skipWhile(n => n < 4)
                .gather()
                .then(result => {
                    context.deepEqual(result, [4, 5, 6, 7]);
                });
        },
        'skipWhile should respect the end of the source': context => {
            return iterate([1, 2, 3, 4, 5, 6, 7])
                .skipWhile(n => n < 5150)
                .gather()
                .then(result => {
                    context.deepEqual(result, []);
                });
        }
    }
};
