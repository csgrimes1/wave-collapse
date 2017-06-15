'use strict';

const sinon = require('sinon'),
    defer = require('../src/deferred');

module.exports = {
    beforeTest: t => {
        return t.createContext('deferred', 'deferred promise', null, 1000/*timeout/ms*/);
    },

    tests: {
        'deferred resolve': context => {
            const val = 2112,
                d = defer();
            setTimeout(() => d.resolve(val), 10);
            return d.promise.then(result => {
                context.equal(result, val);
            });
        },
        'deferred reject': context => {
            const err = new Error('really serious stuff'),
                d = defer(),
                spy = sinon.spy();
            setTimeout(() => d.reject(err), 10);
            return d.promise.catch(x => {
                    spy();
                    context.equal(x, err);
                })
                .then(() => {
                    context.ok(spy.called);
                });
        }
    }
};
