'use strict';

const completionMonad = require('./completion-monad'),
    instructions = require('./instructions');

module.exports = function consume (iterator, callback) {
    return completionMonad.smartConstruction((resolve, reject) => {
        let count = 0;

        function isStop (value) {
            if (value === instructions.STOP) {
                resolve(count);
                return true;
            }
        }
        function doCallbackAction (value) {
            if (value === instructions.SKIP) {
                //Keep looping
                return true;
            }
            if (value === instructions.STOP) {
                return false;
            }
            if (callback(value, count)) {
                count++;
                return true;
            }
            //No more loopie
            return false;
        }
        function resumeAsync(promise, iterator, callback) {
            promise.then(value => {
                if (isStop(value)) {
                    //loop is broken
                    return;
                }
                if (doCallbackAction(value)) {
                    process.nextTick(rawConsume, iterator, callback);
                } else {
                    resolve(count);
                }
            })
                .catch(x => {
                    reject(x);
                });
        }
        function rawConsume (iterator, callback) {  //eslint-disable-line
            try {
                for (let current = iterator.next(); !current.done; current = iterator.next()) {
                    const cmonad = current.value;
                    if (cmonad.synchronous || cmonad.fulfilled) {
                        if (!doCallbackAction(cmonad.value)) {
                            resolve(count);
                            return;
                        }
                    } else {
                        resumeAsync(cmonad, iterator, callback);
                        return;
                    }
                }
                resolve(count);
            } catch (x) {
                reject(x);
            }
        }
        rawConsume(iterator, callback);
    });
};
