'use strict';

const resumer = require('./resumer'),
    completionMonad = require('./completion-monad');

module.exports = function consume (iterator, callback) {
    return completionMonad.smartConstruction((resolve, reject) => {
        let count = 0;
        function rawConsume (iterator, callback) {  //eslint-disable-line
            try {
                for (let current = iterator.next(); !current.done; current = iterator.next()) {
                    console.log(`next value: ${require('util').inspect(current.value)}`);//eslint-disable-line
                    if (current.value instanceof resumer.Resumer) {
                        current.value.resume((value) => {   //eslint-disable-line no-loop-func
                            console.log('it is a resumer', value);//eslint-disable-line
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
