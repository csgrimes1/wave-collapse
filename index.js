'use strict';

module.exports = Object.assign({}, {
    createIterator: require('./src/transform-consume'),   //eslint-disable-line
    createPermutation: require('./src/permutation')        //eslint-disable-line
});
