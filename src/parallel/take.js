'use strict';

function takeWhile (predicate) {
    const me = this,
        producer = function *() {
            let index = 0;
            for (const val of me) {
                if (predicate(val, index)) {
                    yield val;
                } else {
                    break;
                }
                index++;
            }
        };

    return me.internalApi.reiterate(producer());
}

function take (howMany) {
    return takeWhile.call(this, (val, index) => index < howMany);
}

module.exports = {
    take,
    takeWhile
};
