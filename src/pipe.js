'use strict';

const defer = require('./defer');
const promiseTry = require('./promise-try');
const ResponseCodes = {
    callAgain: `callAgain ${Date.now()}`,
    done: `done ${Date.now() + 1}`
};

function scheduleMessage (receiver, message, resolve, reject) {
    return promiseTry(() => receiver.onMessage(message, Object.assign({}, ResponseCodes)))
        .then(result => {
            if (result === ResponseCodes.callAgain) {
                setTimeout(() => {
                    scheduleMessage(receiver, message, resolve, reject);
                }, 0);
            } else {
                resolve(result);
            }
        })
        .catch(x => {
            reject(x);
        });
}

function pipeIterable (pipe) {
    //Initialize a way to block each time next is called. This is how the algorithm stays lazy.
    let lastItem = defer(),
        localError;
    lastItem.resolve();

    return {
        next: () => {
            if (localError) {
                throw localError;
            }
            if (pipe.error()) {
                throw pipe.error();
            }
            if (pipe.isDone()) {
                return {done: true};
            }

            const blocker = lastItem.promise;
            lastItem = defer();
            const iterator = {
                value: blocker
                    .then(() => pipe.send())
                    .then(result => {
                        lastItem.resolve();
                        iterator.done = (result === ResponseCodes.done);
                        return result;
                    })
                    .catch(x => {
                        localError = x;
                        lastItem.reject(x);
                    }),
                done: false
            };
            return iterator;
        }
    };
}

function createPipe (receiver) {
    let done = false;
    let error = null;
    return {
        send: (message) => {
            if (done) {
                throw new Error('Cannot send on closed pipe');
            }
            return new Promise((resolve, reject) => {
                    scheduleMessage(receiver, message, resolve, reject);
                })
                .then(result => {
                    done = (result === ResponseCodes.done);
                    return result;
                })
                .catch(x => {
                    done = true;
                    error = x;
                    return Promise.reject(x);
                });
        },
        isDone: () => done || receiver.isDone(),
        error: () => error || receiver.error()
    };
}

module.exports = {
    //Pipe can be used for iterables when receiver ignores message content.
    createIterablePipe: (receiver) => {
        const pipe = createPipe(receiver);

        return {
            [Symbol.iterator]: () => pipeIterable(pipe)
        };
    }
};
