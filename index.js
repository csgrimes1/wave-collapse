'use strict';

const lazyApiFactory = require('./src/lazy-api-factory');
const standardTransforms = require('./src/standard-transforms');
const commonReducers = require('./src/common-reducers');
const combination = require('./src/combination');

function createDefaultApi () {
    const lazyApi = lazyApiFactory(standardTransforms);
    return Object.assign({}, commonReducers, {
        iterateOver: lazyApi.iterateOver,
        combinations: (iterable) => combination(iterable, lazyApi)
    });
}

module.exports = {
    makeLazyApi: (transformers = standardTransforms) => lazyApiFactory(transformers),
    reducers: commonReducers,
    combinations: (iterable, lazyApi) => combination(iterable, lazyApi),
    defaultApi: createDefaultApi()
};
