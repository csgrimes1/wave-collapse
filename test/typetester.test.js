'use strict';

const typetester = require('../src/typetester'),
    bluebird = require('bluebird');

module.exports = {
    beforeTest: t => {
        return t.createContext('typetester', 'typetester');
    },

    tests: {
        'should know a promise': context => {
            context.equal(typetester.isPromise(Promise.resolve()), true, 'recognizes native promise');
            context.equal(typetester.isPromise(bluebird.resolve()), true, 'recognizes bluebird promise');
        },

        'should know an iterator': context => {
            const it = (function *(){}());

            context.equal(typetester.isIterator(it), true, 'recognizes an iterator');
        }
    }
};
