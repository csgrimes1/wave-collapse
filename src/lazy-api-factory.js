'use strict';

const sto = require('./stack-transformation-over');
const curry = require('./curry');
const reduce = require('./reduce');
const commonReducers = require('./common-reducers');

function toIterable (iterable, obj) {   //eslint-disable-line
    return Object.assign({}, obj, {
        [Symbol.iterator]: function *() {
            for (const item of iterable) {
                yield item;
            }
        }
    });
}

function bind (iterable, transformBuilders) {
    const myType = 'lazyiterable';
    if (iterable && iterable.type === myType) {
        return iterable;
    }

    const txNames = Object.getOwnPropertyNames(transformBuilders);
    const x2 = txNames
        .map(funcName => {
            const xBuilder = transformBuilders[funcName];
            //Add a method accepting 0..n arguments, returning a bind over a transformer.
            const method = function () {
                const xf0n = xBuilder.apply(null, Array.from(arguments));
                return bind(sto(iterable, xf0n, xBuilder.asynchronous), transformBuilders);
            };
            return {[funcName]: method};
        });
    const x3 = Object.assign.apply(null, x2);
    const reduction = {
        reduce: curry(iterable, reduce),
        visit: (visitorCallback) => reduce(iterable, commonReducers.visit(visitorCallback))
    };
    const info = {
        type: myType,
        toString: () => `LazyIterable; transforms=${txNames}`
    };
    return toIterable(iterable, Object.assign(info, x3, reduction));
}

//The first level needs an identity transform yielding
//completionMonad.resolve([item]) for each item. Assume
//they come in as atoms.
function bindOuter(iterable, transformers) {
    return bind(sto(iterable, item => [item]),
        transformers);
}


//Transformers: object/map of transform functions.
//Terminators: object/map of terminators
//In both cases, the passed functions must have a .name property.
module.exports = function lazyApiBuilder (transformers) {
    return {
        iterateOver: (iterable) => bindOuter(iterable, transformers)
    };
};
