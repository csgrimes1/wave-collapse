'use strict';

const resumer = require('./resumer'),
    completionMonad = require('./completion-monad');

const logga = console.log;//eslint-disable-line
module.exports = function consume (iterator, callback) {
    return completionMonad.smartConstruction((resolve, reject) => {
        let count = 0;
        function rawConsume (iterator, callback) {  //eslint-disable-line
            try {
                for (let current = iterator.next(); !current.done; current = iterator.next()) {
                    if (current.value instanceof resumer.Resumer) {
                        current.value.resume((value) => {   //eslint-disable-line no-loop-func
                            logga('==========> consumer loop', require('util').inspect(current), '==>', value);   //eslint-disable-line
                            if (callback(value, count)) {
                                count++;
                                process.nextTick(rawConsume, iterator, callback);
                            } else {
                                resolve(count);
                            }
                        })
                            .catch(x => {
                                reject(x);
                            });
                        return;
                    }
                    if (!callback(current.value, count)) {
                        break;
                    }
                    count++;
                }
                resolve(count);
            } catch (x) {
                reject(x);
            }
        }
        rawConsume(iterator, callback);
    });
}
