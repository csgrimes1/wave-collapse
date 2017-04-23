'use strict';


module.exports = function filter (predicate) {
    const me = this,
        producer = function *() {
            let index = 0;
            for (const val of me) {
                if (predicate(val, index)) {
                    yield val;
                }
                index++;
            }
        };

    return me.internalApi.reiterate(producer());
};
