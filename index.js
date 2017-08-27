'use strict';

const lazyApiFactory = require('./src/lazy-api-factory');
const standardTransforms = require('./src/standard-transforms');
const commonReducers = require('./src/common-reducers');
const permutation = require('./src/permutation');

function createDefaultApi () {
    const lazyApi = lazyApiFactory(standardTransforms);
    return Object.assign({}, commonReducers, {
        iterateOver: lazyApi.iterateOver,
        permutation: (iterable) => permutation(iterable, lazyApi)
    });
}

module.exports = {
    makeLazyApi: (transformers = standardTransforms) => lazyApiFactory(transformers),
    reducers: commonReducers,
    permutation: (iterable, lazyApi) => permutation(iterable, lazyApi),
    defaultApi: createDefaultApi()
};
