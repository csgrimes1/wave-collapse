'use strict';

const generators = require('./generators');
const transformConsume = require('../src/transform-consume');
const sinon = require('sinon');

module.exports = {
    beforeTest: t => {
        return t.createContext('shortname', 'long description', null, 1000/*timeout/ms*/);
    },

    tests: {
        'stopping via callback': context => {
            return transformConsume(generators.syncgen(10))
                .collect((_, index) => index < 2)
                .then(ar => {
                    context.deepEqual(ar, [0, 1]);
                });
        },
        'asynchronously stopping via callback': context => {
            const spy = sinon.spy();
            const p = transformConsume(generators.asyncgen(10))
                .collect((_, index) => index < 2)
                .then(ar => {
                    spy();
                    context.deepEqual(ar, [0, 1]);
                });
            //Should not be called in the synchronous path.
            context.ok(!spy.called);
            return p;
        },
        'map': context => {
            return transformConsume(generators.syncgen(10))
                .map(n => n * 5)
                .collect()
                .then(ar => {
                    context.deepEqual(ar, [0, 5, 10, 15, 20, 25, 30, 35, 40, 45]);
                });
        },
        'filter': context => {
            return transformConsume(generators.syncgen(10))
                .filter(n => n % 2 === 0)
                .collect()
                .then(ar => {
                    context.deepEqual(ar, [0, 2, 4, 6, 8]);
                });
        },
        'await': context => {
            const data = [1, 2, 3, 4];
            const promises = data.map(x => Promise.resolve(x));
            const asyncSpy = sinon.spy();
            const p = transformConsume(promises)
                .awaitEach()
                .map(x => console.log(x) || x + 1)  //eslint-disable-line
                .collect()
                .then(ar => {
                    context.deepEqual(ar, [2, 3, 4, 5]);
                });
            context.ok(!asyncSpy.called);
            return p;
        },
        'skip': context => {
            return transformConsume(generators.syncgen(10))
                .skip(5)
                .collect()
                .then(ar => {
                    context.deepEqual(ar, [5, 6, 7, 8, 9]);
                });
        },
        'skipWhile': context => {
            return transformConsume(generators.syncgen(10))
                .skipWhile((item) => item < 5)
                .collect()
                .then(ar => {
                    context.deepEqual(ar, [5, 6, 7, 8, 9]);
                });
        },
        'take': context => {
            return transformConsume(generators.syncgen(100000000))
                .take(5)
                .collect()
                .then(ar => {
                    context.deepEqual(ar, [0, 1, 2, 3, 4]);
                });
        },
        'takeWhile': context => {
            return transformConsume(generators.syncgen(10))
                .takeWhile((_, index) => index < 5)
                .collect()
                .then(ar => {
                    context.deepEqual(ar, [0, 1, 2, 3, 4]);
                });
        },
        'flatten': context => {
            return transformConsume([[1, 2], [3, 4]])
                .flatten()
                .collect()
                .then(ar => {
                    context.deepEqual(ar, [1, 2, 3, 4]);
                });
        },
        'reduce': context => {
            const spy = sinon.spy(),
                p = transformConsume(generators.syncgen(3))
                    .reduce((acc, cur) => acc + cur, 0)
                    .then(result => {
                        spy();
                        context.equal(result, 3);
                    });
            context.ok(spy.called);
            return p;
        },
        'reduce asynchronous': context => {
            const spy = sinon.spy(),
                p = transformConsume(generators.asyncgen(3))
                    .reduce((acc, cur) => acc + cur, 0)
                    .then(result => {
                        spy();
                        context.equal(result, 3);
                    });
            context.ok(!spy.called);
            return p;
        }
    }
};
