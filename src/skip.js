'use strict';

function skipWhile (predicate) {
    const reversePredicate = (val, index) => !predicate(val, index);

    return this.filter(reversePredicate);
}

function skip (howMany) {
    return skipWhile.call(this, (val, index) => index < howMany);
}

module.exports = {
    skip,
    skipWhile
};
