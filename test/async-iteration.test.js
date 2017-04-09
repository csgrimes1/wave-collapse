'use strict';

const asyncProducer = require('./async-producer'),
    iterate = require('../src/iterate');

module.exports = {
    beforeTest: t => {
        return t.createContext('async', 'async iteration tests', null, 2000/*timeout/ms*/);
    },

    tests: {
        'should handle an async producer': context => {
            return iterate(asyncProducer())
                .series()
                .take(5)
                .gather()
                .then(result => {
                    context.equal(result.length, 5);
                });
        }
    }
};
