'use strict';

function *syncgen(count, mapper = (x) => x) {
    for (let n = 0; n < count; n++) {
        yield mapper(n);
    }
}
function *asyncgen(count, mapper = (x) => x) {
    for (let n = 0; n < count; n++) {
        yield Promise.resolve(mapper(n));
    }
}

module.exports = {
    syncgen,
    asyncgen
};
