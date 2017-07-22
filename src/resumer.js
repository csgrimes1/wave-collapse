'use strict';

const completionMonad = require('./completion-monad');

class Resumer {
    constructor (promise) {
        this.name = '___resumer___';
        this.promise = promise;
        this.xpush = function *(others) {
                //console.log('Resumer iterator:', Array.from(others));//eslint-disable-line
            for (const item of others) {
                    console.log(`Making resumer for ${require('util').inspect(Object.getOwnPropertyNames(item))}  ${item instanceof Resumer}`)//eslint-disable-line
                if (item instanceof Resumer) {
                    console.log(' ...resumer trace 1');//eslint-disable-line
                    yield new Resumer(item.promise);
                } else {
                    console.log(' ...resumer trace 2');//eslint-disable-line
                    yield new Resumer(completionMonad.resolve(item));
                }
            }
        }
        this.push = (item) => {
                    console.log(`Making resumer for ${require('util').inspect(Object.getOwnPropertyNames(item))}  ${item instanceof Resumer}`)//eslint-disable-line
            return item instanceof Resumer ? new Resumer(item.promise) : new Resumer(completionMonad.resolve(item));
        }
    }
    resume (callback) {
        return this.promise.then(callback);
    }

    toString () {
        return `Resumer: ${this.promise}`;
    }
}

module.exports = {
    Resumer,
    resumeUpon: promise => new Resumer(promise)
};
