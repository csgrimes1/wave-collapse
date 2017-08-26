'use strict';

const waveCollapse = require('../../index').makeLazyApi();
const args = process.argv.slice(2);
const timeout = args[0] || 1000;

const fire = () => {
    const t1 = new Date().getTime();
    return new Promise(done => {
        setTimeout(() => {
            const elapsed = new Date().getTime() - t1;
            console.log(`${elapsed} ms elapsed after setTimeout call.`);
            done(Math.abs(elapsed - timeout));
        }, timeout);
    });
};

const rounds = [fire, fire, fire, fire, fire];

waveCollapse.iterateOver(rounds)
    .map(lambda => lambda())
    .reduce((acc, cur) => acc + cur, 0)
    .then(sum => {
        console.log(`Average deviation: ${sum / rounds.length} ms`);  //eslint-ignore-line
    });
