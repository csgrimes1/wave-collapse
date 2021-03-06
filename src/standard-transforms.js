'use strict';

const instructions = require('./instructions');
const SKIP = instructions.SKIP;
const STOP = instructions.STOP;
const completionMonad = require('./completion-monad');

function asyncIterator(monadOfCollection) {
    let tail;
    return {
        next: () => {
            if (tail && tail.length <= 0) {
                return {done: true};
            }
            const p = monadOfCollection.then(items => { //eslint-disable-line
                if (observeInstructions(items)) {
                    tail = [];
                    return items;
                }
                if (!tail) {
                    tail = Array.from(items)
                        .map(item => completionMonad.resolve(item));
                }
                if (tail.length <= 0) {
                    return SKIP;
                }
                const result = tail[0];
                tail = tail.slice(1);
                return result;
            });
            return {value: p, done: false};
        }
    };
}

function asyncIterable(monadOfCollection) {
    return {
        [Symbol.iterator]: () => asyncIterator(monadOfCollection)
    };
}

function observeInstructions(val) {
    if (val === SKIP || val === STOP) {
        return true;
    }
}

module.exports = {
    map: (mapper) => {
        return (atomicValueMonad, index) => [
            atomicValueMonad.then((val) => {
                if (observeInstructions(val)) {
                    return val;
                }
                return mapper(val, index);
            })
        ]
    },
    filter: (predicate) => {
        return (atomicValueMonad, index) => [
            atomicValueMonad.then((val) => {
                if (observeInstructions(val)) {
                    return val;
                }
                return predicate(val, index) ? val : SKIP;
            })
        ]
    },
    skip: (number) => {
        return (atomicValueMonad, index) => [
            atomicValueMonad.then((val) => {
                if (observeInstructions(val)) {
                    return val;
                }
                return index >= number ? val : SKIP;
            })
        ]
    },
    skipWhile: (predicate) => {
        return (atomicValueMonad, index) => [
            atomicValueMonad.then((val) => {
                if (observeInstructions(val)) {
                    return val;
                }
                return predicate(val, index) ? SKIP : val;
            })
        ]
    },
    take: (number) => {
        return (atomicValueMonad, index) => [
            atomicValueMonad.then((val) => {
                if (observeInstructions(val)) {
                    return val;
                }
                return index >= number ? STOP : val;
            })
        ]
    },
    takeWhile: (predicate) => {
        return (atomicValueMonad, index) => [
            atomicValueMonad.then((val) => {
                if (observeInstructions(val)) {
                    return val;
                }
                return predicate(val, index) ? val : STOP;
            })
        ]
    },
    flatten: () => {
        //Iterable of completion monads
        return (monadOfCollection) => {
            return asyncIterable(monadOfCollection);
        }
    }
};
