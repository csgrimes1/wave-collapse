'use strict';

const promiseTry = require('../src/promise-try'),
    sinon = require('sinon');

module.exports = {
    beforeTest: t => {
        return t.createContext('promise-try', 'promise try semantics', null, 2000/*timeout/ms*/);
    },

    tests: {
        'should return a promise on a synchronous callback': context => {
            const promise = promiseTry(() => {});
            context.equal(typeof promise.then, 'function');
        },

        'should return the promise from an asynchronous callback': context => {
            const expected = 100;
            return promiseTry(() => Promise.resolve(expected))
                .then(result => {
                    context.equal(result, expected);
                });
        },

        'should reject on a synchronous exception': context => {
            const thrower = () => {
                throw new Error('Duck! It\'s an error!');
            };
            const catchSpy = sinon.spy();
            return promiseTry(thrower)
                .catch(() => {
                    catchSpy();
                })
                .then(() => {
                    context.ok(catchSpy.called);
                });
        },

        'should reject on a callback returning a rejected promise': context => {
            const error = new Error('This is bad...');
            const rejector = () => Promise.reject(error);
            const catchSpy = sinon.spy();

            return promiseTry(rejector)
                .catch(x => {
                    context.deepEqual(x, error);
                    catchSpy();
                })
                .then(() => {
                    context.ok(catchSpy.called);
                });
        }
    }
};
