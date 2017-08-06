'use strict';

const lazyApiFactory = require('./src/lazy-api-factory');
const standardTransforms = require('./src/standard-transforms');
const commonReducers = require('./src/common-reducers');

module.exports = {
    makeLazyApi: (transformers = standardTransforms) => lazyApiFactory(transformers),
    //createPermutation: require('./src/permutation')        //eslint-disable-line
    reducers: commonReducers
};
