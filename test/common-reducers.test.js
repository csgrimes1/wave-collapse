'use strict';

const index = require('../index');
const api = index.makeLazyApi();
const commonReducers = require('../src/common-reducers');
const sinon = require('sinon');

module.exports = {
    beforeTest: t => {
        return t.createContext('common-reducers', 'common reduction lambdas', null, 100);
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
        'count operation': context => {
            return api.iterateOver([1, 2, 3])
                .reduce(commonReducers.count)
                .then(result => {
                    context.equal(result, 3);
                });
        },
        'count operation on zero length iterable': context => {
            return api.iterateOver([])
                .reduce(commonReducers.count)
                .then(result => {
                    context.equal(result, 0);
                });
        },
        'toArray operation': context => {
            const ar = ['a', 'b', 'c', 'd'];
            return api.iterateOver(ar)
                .reduce(index.reducers.toArray)
                .then(result => {
                    context.deepEqual(result, ar);
                });
        },
        'zero length toArray operation': context => {
            const ar = [];
            return api.iterateOver(ar)
                .reduce(index.reducers.toArray)
                .then(result => {
                    context.deepEqual(result, ar);
                });
        },
        'visit': context => {
            const ar = [9, 10, 11, 12, 13, 14];
            const visitorSpy = sinon.spy();
            return api.iterateOver(ar)
                .reduce(index.reducers.visit((current, index) => {
                    visitorSpy(current);
                    console.log('pair:', index, ':', current);//eslint-disable-line
                    return index <= 2;
                }))
                .then(() => {
                    context.ok(visitorSpy.calledWith(9));
                    context.ok(visitorSpy.calledWith(12));
                    context.ok(!visitorSpy.calledWith(13));
                    context.ok(!visitorSpy.calledWith(14));
                });
        }
    }
};
