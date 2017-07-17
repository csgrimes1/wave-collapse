'use strict';

const waveCollapse = require('../../index');
const args = process.argv.slice(2);
const timeout = args[0] || 100;
const rounds = args[1] || 100;

function fire () {
    const t1 = new Date().getTime();
    return new Promise(done => {
        setTimeout(() => {
            const endTime = new Date().getTime();
            const elapsed = endTime - t1;
            console.log(`${elapsed} ms elapsed after setTimeout call.`);
            done({startTime: t1, endTime, elapsed});
        }, timeout);
    });
}

function *fireAll () {
    for (let n = 0; n < 10000000; n++) {
        console.log(`Round #${n + 1}`);
        yield fire();
    }
}

waveCollapse.createIterator(fireAll())
    .awaitEach()
    .map(summary => console.log(JSON.stringify(summary)) || Math.abs(summary.elapsed - timeout))
    .take(rounds)
    .reduce((acc, cur) => acc + cur, 0)
    .then(sum => {
        console.log(`Average deviation: ${sum / rounds} ms`);
    });
