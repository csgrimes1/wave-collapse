'use strict';

const SKIP = {ignore: true};
const STOP = {stop: true};

function recognize (instruction) {
    const func = (val) => {
        if (val === instruction)
            return true;
        if (val.synchronous && val.value && val.status === 0)
            return func(val.value);
        return false;
    };
    return func;
}

module.exports = {
    SKIP,
    STOP,
    shouldSkip: recognize(SKIP),
    shouldStop: recognize(STOP)
};
