'use strict';

const index = require('../index');
const lazyApi = index.makeLazyApi();
const reducers = index.reducers;
const sinon = require('sinon');

module.exports = {
    beforeTest: t => {
        return t.createContext('index', 'tests for wholistic API');
    },

    tests: {
        'filter must hide filtered out items': (context) => {
            const data = [0, 1, 2, 3, 4, 5];
            const mapSpy = sinon.spy();

            return lazyApi.iterateOver(data)
                .filter(item => item % 2 === 0)
                .map(item => {
                    mapSpy();
                    return item;
                })
                .reduce(reducers.toArray)
                .then(() => {
                    context.equal(mapSpy.callCount, 3);
                })
                .catch(() => {})
        }
    }
};
