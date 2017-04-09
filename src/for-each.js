'use strict';


module.exports = function forEach (callback) {
    const iteration = this;

    return new Promise((resolve, reject) => {
        let count = 0;
        let error;
        const callbackWrapper = (data) => {
            if (data.valid) {
                try {
                    const res = callback(data.value, data.index);
                    count++;
                    return res;
                } catch (x) {
                    reject(x);
                    error = x;
                }
            } else if (!error) {
                resolve(count);
            }
            return false;
        };

        iteration.visit(callbackWrapper);
    });
};
