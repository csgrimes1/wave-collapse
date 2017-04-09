'use strict';

module.exports = function map (mapper) {
    const me = this,
        producer = function (callback) {
            const localCallback = (val, index, done) => {
                const newVal = mapper(val, index);

                return callback(newVal, index, done);
            };

            return me.produce(localCallback);
        };

    return me.internalApi.wrapIterator(producer);
};
