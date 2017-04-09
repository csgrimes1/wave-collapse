'use strict';


module.exports = function filter (predicate) {
    return this.internalApi.wrapIterator(this, predicate);
};
