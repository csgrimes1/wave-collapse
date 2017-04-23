'use strict';

const iterate = require('../../src/iterate');

module.exports = {
    beforeTest: t => {
        return t.createContext('filter', 'filter', null, 1000/*timeout/ms*/);
    },

    tests: {
        'filter should include only matching elements': context => {
            return iterate([1, 2, 3, 4, 5, 5, 5, 5])
                .filter((val) => val % 2 === 0)
                .gather(results => {
                    context.deepEqual(results, [2, 4]);
                });
        }
    }
};
