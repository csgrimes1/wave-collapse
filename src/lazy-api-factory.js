'use strict';

const sto = require('./stack-transformation-over');
const curry = require('./curry');

function toIterable (iterable, obj) {   //eslint-disable-line
    return Object.assign({}, obj, {
        [Symbol.iterator]: function *() {
            for (const item of iterable) {
                yield item;
            }
        }
    });
}

function bind (iterable, transformBuilders, terminators) {
    const txNames = Object.getOwnPropertyNames(transformBuilders);
    const termNames = Object.getOwnPropertyNames(terminators);
    const x2 = txNames
        .map(funcName => {
            const xBuilder = transformBuilders[funcName];
            //Add a method accepting 0..n arguments, returning a bind over a transformer.
            const method = function () {
                const xf0n = xBuilder.apply(null, Array.from(arguments));
                return bind(sto(iterable, xf0n, xBuilder.synchronous), transformBuilders, terminators);
            };
            return {[funcName]: method};
        });
    const terms2 = termNames
        .map(funcName => {
            const callback = terminators[funcName];
            return {[funcName]: curry(iterable, callback)};
        });
    const x3 = Object.assign.apply(null, x2);
    const t3 = Object.assign.apply(null, terms2);
    const info = {
        toString: () => `LazyIterable; transforms=${txNames}; terminators=${terminators}`
    };
    return toIterable(iterable, Object.assign(info, x3, t3));
}


//Transformers: object/map of transform functions.
//Terminators: object/map of terminators
//In both cases, the passed functions must have a .name property.
module.exports = function lazyApiBuilder (transformers, terminators) {
    return {
        iterateOver: (iterable) => bind(iterable, transformers, terminators)
    };
};
