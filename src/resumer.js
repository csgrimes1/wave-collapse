'use strict';

class Resumer {
    constructor (promise) {
        this.promise = promise;
    }
    resume (callback) {
        return this.promise.then(callback);
    }
}

module.exports = {
    Resumer,
    resumeUpon: promise => new Resumer(promise)
};
