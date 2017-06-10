'use strict';

const resumer = require('../src/resumer');

function *syncgen(count, mapper = (x) => x) {
    for (let n = 0; n < count; n++) {
        yield mapper(n);
    }
}
function *asyncgen(count, mapper = (x) => x) {
    for (let n = 0; n < count; n++) {
        yield resumer.resumeUpon(Promise.resolve(mapper(n)));
    }
}

module.exports = {
    syncgen,
    asyncgen
};
