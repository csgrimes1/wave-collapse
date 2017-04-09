'use strict';

const iterate = require('../src/iterate');

module.exports = {
    beforeTest: t => {
        return t.createContext('gather', 'gather all items to an array', null, 1000/*timeout/ms*/);
    },

    tests: {
        'gather results of iteration': context => {
            const ar = [2, 3, 4, 5, 10];

            return iterate(ar)
                .gather()
                .then(result => {
                    context.deepEqual(result, ar, 'should get similar array back');
                });
        }
    }
};
