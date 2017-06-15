'use strict';

const isAsyncPromise = require('./typetester').isPromise,
    fulfilled = 0,
    rejected = 1,
    defer = require('./deferred');

class CompletionMonad {
    constructor () {
        this.synchronous = true;
    }

    static resolve(value) {
        if (isAsyncPromise(value)) {
            return Promise.resolve(value);
        } else if (value instanceof CompletionMonad) {
            return CompletionMonad.resolve(value.value);
        }
        const p = new CompletionMonad();

        p.value = value;
        p.status = fulfilled;
        return Object.freeze(p);
    }

    static reject(error) {
        if (isAsyncPromise(error)) {
            return error.catch((e) => Promise.reject(e));
        } else if (error instanceof CompletionMonad) {
            return CompletionMonad.reject(error.error);
        }
        const p = new CompletionMonad();
        p.error = error;
        p.status = rejected;
        return Object.freeze(p);
    }

    static attempt(callback) {
        try {
            return CompletionMonad.resolve(callback());
        } catch (x) {
            return CompletionMonad.reject(x);
        }
    }

    then(callback) {
        if (this.status === rejected)
            return this;
        else {
            try {
                return CompletionMonad.resolve(callback(this.value));
            } catch (x) {
                return CompletionMonad.reject(x);
            }
        }
    }

    ['catch'](callback) {
        if (this.status === fulfilled)
            return this;
        else {
            try {
                return CompletionMonad.resolve(callback(this.error));
            } catch (x) {
                return CompletionMonad.reject(x);
            }
        }
    }

}

function smartConstruction (callback) {
    let whatWasCalled = 0;
    let theResult;
    const deferred = defer();
    const resolve = (val) => {
        if (whatWasCalled > 0) {
            return;
        }

        whatWasCalled = 1;
        theResult = val;
        deferred.resolve(val);
    };
    const reject = (x) => {
        if (whatWasCalled > 0) {
            return;
        }

        whatWasCalled = 2;
        theResult = x;
        deferred.reject(x);
    };

    //If resolve or rect are called synchronously...
    callback(resolve, reject);
    //...we'll know this after callback returns.
    switch (whatWasCalled) {
        //Synchronous resolve
        case 1:
            return CompletionMonad.resolve(theResult);
        //Synchronous reject
        case 2:
            return CompletionMonad.reject(theResult);

        default:
            return deferred.promise;
    }
}

module.exports = {
    resolve: (val) => CompletionMonad.resolve(val),
    reject: (err) => CompletionMonad.reject(err),
    attempt: (callback) => CompletionMonad.attempt(callback),
    smartConstruction,
    classType: CompletionMonad
};
