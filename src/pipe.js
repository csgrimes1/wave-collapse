'use strict';

const ResponseCodes = {
    callAgain: Symbol.callAgain,
    done: Symbol.done
};

function sendingLoop (receiver, message, resolve, reject) {
    return Promise.resolve(receiver.onMessage(message, Object.assign({}, ResponseCodes)))
        .then(result => {
            switch (result) {
                case ResponseCodes.callAgain:
                    setTimeout(() => {
                        sendingLoop(receiver, message, resolve, reject);
                    }, 0);
                    break;
                default:
                    resolve(result);
                    break;
            }
        })
        .catch(x => reject(x));
}

module.exports = {
    createPipe: (receiver) => {
        let done = false;
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
                    });
            },
            isDone: () => {
                return done;
            }
        };
    }
};
