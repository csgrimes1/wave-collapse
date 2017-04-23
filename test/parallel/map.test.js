'use strict';

const iterate = require('../../src/iterate');

module.exports = {
    beforeTest: t => {
        return t.createContext('map', 'map', null, 2000/*timeout/ms*/);
    },

    tests: {
        'should transform a sequence': context => {
            const testArray = [101, 102, 103, 104];
            return iterate(testArray)
                .map(n => n + 1)
                .gather()
                .then(result => {
                    context.deepEqual(result, testArray.map(n => n + 1));
                });
        }
    }
};
