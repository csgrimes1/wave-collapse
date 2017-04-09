'use strict';

function takeWhile (predicate) {
    const me = this,
        producer = function (callback) {
            const localCallback = (val, index, done) => {
                if (predicate(val, index)) {
                    return callback(val, index, done);
                } else {
                    return false;
                }
            };

            return me.produce(localCallback);
        };

    return me.internalApi.wrapIterator(producer);
}

function take (howMany) {
    return takeWhile.call(this, (val, index) => index < howMany);
}

module.exports = {
    take,
    takeWhile
};
