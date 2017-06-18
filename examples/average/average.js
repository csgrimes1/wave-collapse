'use strict';

const waveCollapse = require('../../index');
const args = process.argv.slice(2);
const timeout = args[0] || 100;
const rounds = args[1] || 100;

function fire () {
    const t1 = new Date().getTime();
    return new Promise(done => {
        setTimeout(() => {
            const elapsed = new Date().getTime() - t1;
            done(Math.abs(elapsed - timeout));
        }, timeout);
    });
}

function *fireAll () {
    for (let n = 0; n < rounds; n++) {
        yield fire();
    }
}

waveCollapse.createIterator(fireAll())
    .awaitEach()
    .reduce((acc, cur) => acc + cur, 0)
    .then(sum => {
        console.log(`Average deviation: ${sum / rounds}`);
    });