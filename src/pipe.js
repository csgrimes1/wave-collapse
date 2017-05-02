'use strict';

const defer = require('./defer');
const ResponseCodes = {
    callAgain: `callAgain ${Date.now()}`,
    done: `done ${Date.now() + 1}`
};

function sendingLoop (receiver, message, resolve, reject) {
    return Promise.resolve(receiver.onMessage(message, Object.assign({}, ResponseCodes)))
        .then(result => {
            if (result === ResponseCodes.callAgain) {
                setTimeout(() => {
                    sendingLoop(receiver, message, resolve, reject);
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
    //Initialize a way to block each time next is called.
    let lastItem = defer();
    lastItem.resolve();

    return {
        next: () => {
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
                    }),
                done: false
            };
            return iterator;
        }
    };
}

module.exports = {
    createPipe: (receiver) => {
        let done = false;
        let error = null;
        return {
            send: (message) => {
                if (done) {
                    throw new Error('Cannot send on closed pipe');
                }
                return new Promise((resolve, reject) => {
                        sendingLoop(receiver, message, resolve, reject);
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
    },
    //Pipe can be used for iterables when receiver ignores message content.
    createIterablePipe: (receiver) => {
        const pipe = module.exports.createPipe(receiver);

        return {
            [Symbol.iterator]: () => pipeIterable(pipe)
        };
    }
};
