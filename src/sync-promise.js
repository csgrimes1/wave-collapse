'use strict';

const isPromise = require('./typetester').isPromise,
    fulfilled = 0,
    rejected = 1;

function isAnyKindOfPromise (value) {
    if (value) {
        return isPromise(value) || value instanceof SyncPromise;
    }
}

class SyncPromise {
    static resolve(value) {
        if (isAnyKindOfPromise(value)) {
            return Promise.resolve(value);
        }
        const p = new SyncPromise();

        p.value = value;
        p.status = fulfilled;
        return Object.freeze(p);
    }

    static reject(error) {
        if (isAnyKindOfPromise(error)) {
            return Promise.resolve(error);
        }
        const p = new SyncPromise();

        p.error = error;
        p.status = rejected;
        return Object.freeze(p);
    }

    static attempt(callback) {
        try {
            return SyncPromise.resolve(callback());
        } catch (x) {
            return SyncPromise.reject(x);
        }
    }

    then(callback) {
        if (this.status === rejected)
            return this;
        else {
            try {
                return SyncPromise.resolve(callback(this.value));
            } catch (x) {
                return SyncPromise.reject(x);
            }
        }
    }

    ['catch'](callback) {
        if (this.status === fulfilled)
            return this;
        else {
            try {
                return SyncPromise.resolve(callback(this.error));
            } catch (x) {
                return SyncPromise.reject(x);
            }
        }
    }

}

function smartConstruction (callback) {
    let whatWasCalled = 0;
    let theResult;
    const resolve = (val) => {
        if (whatWasCalled > 0) {
            return;
        }

        whatWasCalled = 1;
        theResult = val;
    };
    const reject = (x) => {
        if (whatWasCalled > 0) {
            return;
        }

        whatWasCalled = 2;
        theResult = x;
    };

    //If resolve or rect are called synchronously...
    callback(resolve, reject);
    //...we'll know this after callback returns.
    switch (whatWasCalled) {
        //Synchronous resolve
        case 1:
            return SyncPromise.resolve(theResult);
        //Synchronous reject
        case 2:
            return SyncPromise.reject(theResult);

        default:
            return new Promise(callback);
    }
}

module.exports = {
    resolve: (val) => SyncPromise.resolve(val),
    reject: (err) => SyncPromise.reject(err),
    attempt: (callback) => SyncPromise.attempt(callback),
    smartConstruction
};
