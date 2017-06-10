'use strict';

const generators = require('./generators');
const transformConsume = require('../src/transform-consume');
const sinon = require('sinon');

module.exports = {
    beforeTest: t => {
        return t.createContext('shortname', 'long description', null, 1000/*timeout/ms*/);
    },

    tests: {
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
                .collect()
                .then(ar => {
                    context.deepEqual(ar, data);
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
        'take': context => {
            return transformConsume(generators.syncgen(10))
                .take(5)
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
                        console.log('13847190347901743901274908231749')
                    context.deepEqual(ar, [1, 2, 3, 4]);
                });
        }
    }
};
