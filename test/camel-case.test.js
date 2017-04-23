'use strict';

const camelCase = require('../src/camel-case');

module.exports = {
    beforeTest: t => {
        const userData = {};

        return t.createContext('camel-case', 'to camelCase', userData, 1000);
    },

    tests: {
        'should replace dash sequences to camelCase': context => {
            const result = camelCase('foo-bar');

            context.equal(result, 'fooBar');
        }
    }
};
