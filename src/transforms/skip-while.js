'use strict';

module.exports = () => {
    let doneSkipping = false;

    return (item, index, predicate) => {
        if (doneSkipping) {
            return [item];
        } else if (predicate(item, index)) {
            return [];
        } else {
            //state transition happens here.
            doneSkipping = true;
            return [item];
        }
    };
};
