'use strict';

function skipWhile (predicate) {
    const reversePredicate = (val, index) => !predicate(val, index);

    return this.filter(reversePredicate);
}

function skip (howMany) {
    return this.skipWhile((val, index) => index < howMany);
}

module.exports = {
    skip,
    skipWhile
};
