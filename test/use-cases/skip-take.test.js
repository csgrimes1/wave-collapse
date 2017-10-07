'use strict';

const waveCollapse = require('../../index').defaultApi;

module.exports = {
    beforeTest: t => {
        return t.createContext('skip take', 'skip take', null, 1000/*timeout/ms*/);
    },

    tests: {
        //This is a tricky scenario since take relies on indexes.
        'skip followed by take': context => {
            const ar = [101, 102, 103, 104, 105, 106, 107];
            return waveCollapse.iterateOver(ar)
                .skip(2)
                .take(3)
                .reduce(waveCollapse.toArray)
                .then(result => {
                    context.equal(result.length, 3);
                });
        },

        'skip + filter + take': context => {
            const ar = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111];
            return waveCollapse.iterateOver(ar)
                .take(7)
                .filter(i => (i % 5) !== 0)
                .skip(2)
                .take(3)
                .reduce(waveCollapse.toArray)
                .then(result => {
                    context.deepEqual(result, [103, 104, 106]);
                });
        }
    }
};
