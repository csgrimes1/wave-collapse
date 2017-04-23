'use strict';

module.exports = function map (mapper) {
    const me = this,
        producer = function * () {
            let index = 0;
            for (const val of me) {
                yield mapper(val, index++);
            }
        };

    return me.internalApi.reiterate(producer());
};
