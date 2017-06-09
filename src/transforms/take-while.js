'use strict';

const ENDCAP = global.isFinite;

module.exports = () => {
    return (item, index, predicate) => {
        if (predicate(item, index)) {
            return [item];
        } else {
            return [ENDCAP];
        }
    };
};
