'use strict';

const lazyApiFactory = require('./src/lazy-api-factory');
const standardTransforms = require('./src/standard-transforms');
const commonReducers = require('./src/common-reducers');
const permutation = require('./src/permutation');

module.exports = {
    makeLazyApi: (transformers = standardTransforms) => lazyApiFactory(transformers),
    reducers: commonReducers,
    permutation
};
