'use strict';

const pair = (entry) => entry,
    valueOnly = (entry => entry[1]),
    typetester = require('./typetester');

module.exports = {
    of: (target) => {
        if (target === undefined) {
            return [];
        } else if (target === null) {
        } else if (Object.hasOwnProperty(target, Symbol.iterator)) {
            return target[Symbol.iterator];
        } else if (typetester.isIterator(target)) {
            return target;
        } else if (typeof target.entries === 'function') {
            const entryMapper = target instanceof Map ? pair : valueOnly;

            return function *() {
                for (const pair of target.entries()) {
                    yield entryMapper(pair);
                }
            };
        } else if (typeof target === 'object') {
            return function *() {
                for (const k of Object.getOwnPropertyNames(target)) {
                    yield [k, target[k]];
                }
            };
        }
        return [target]
    }
};
