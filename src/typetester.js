'use strict';

module.exports = {
    isPromise: (p) => {
        return p && p.toString() === '[object Promise]';
    },

    isIterator: (thing) => {
        return thing
            && typeof thing.next === 'function';
    }
};
