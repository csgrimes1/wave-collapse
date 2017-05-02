'use strict';

const generator = require('./promise-iterable'),
    iterate = require('../../src/iterate'),
    sinon = require('sinon');

module.exports = {
    beforeTest: t => {
        return t.createContext('shortname', 'long description', null, 2000/*timeout/ms*/);
    },

    tests: {
        'should get request number of interations asynchronously': context => {
            const callSpy = sinon.spy();
            const expected = 11;
            const promise = iterate(generator(23))
                .series()
                .filter((item) => (item % 2) === 0)
                .forEach((val, index) => {
                    console.log(`foreach index: ${index}: ${val}`)
                    callSpy();
                    return true;
                })
                .then(() => {
                    context.equal(callSpy.callCount, expected);
                });

            context.ok(!callSpy.callcount, 'expect no calls in synchronous execution path');
            return promise;
        }
    }
};
