'use strict';

const forEach = require('./for-each'),
    syncPromise = require('../sync-promise');

module.exports = function synchronousGather () {
    const ar = [];

    forEach.call(this, (val) => {
        ar.push(val);
        return true;
    });
    return syncPromise.resolve(ar);
};
