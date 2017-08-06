'use strict';

const index = require('../index');
const api = index.makeLazyApi();
const commonReducers = require('../src/common-reducers');

module.exports = {
    beforeTest: t => {
        return t.createContext('common-reducers', 'common reduction lambdas', null);
    },

    tests: {
        'sum operation': context => {
            const ar = [10, 11, 12];
            return api.iterateOver(ar)
                .reduce(commonReducers.sum)
                .then(result => {
                    context.equal(result, 33);
                });
        },
        'average operation': context => {
            const ar = [20, 25, 30];
            return api.iterateOver(ar)
                .reduce(commonReducers.average)
                .then(result => {
                    context.equal(result, 25);
                });
        },
        'toArray operation': context => {
            const ar = ['a', 'b', 'c', 'd'];
            return api.iterateOver(ar)
                .reduce(index.reducers.toArray)
                .then(result => {
                    context.deepEqual(result, ar);
                });
        }
    }
};
