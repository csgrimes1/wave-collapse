'use strict';

const resumer = require('./resumer');

module.exports = function consume (iterator, callback) {
    return new Promise((resolve, reject) => {
        let count = 0;
        function rawConsume (iterator, callback) {
            try {
                for (let current = iterator.next(); !current.done; current = iterator.next()) {
                    if (current.value instanceof resumer.Resumer) {
                        current.value.resume((value) => {   //eslint-disable: no-loop-func
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
