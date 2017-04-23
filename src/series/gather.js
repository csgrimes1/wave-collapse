'use strict';

module.exports = function gather () {
    const iteration = this;

    return new Promise((resolve) => {
        let ar = []; //eslint-disable-line
        const callback = (data) => {
            if (data.valid) {
                ar.push(data.value);
                return true;
            } else {
                resolve(ar);
            }
        };

        iteration.visit(callback);
    });
};
