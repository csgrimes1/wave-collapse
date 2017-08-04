'use strict';

const instructions = require('./instructions');
const SKIP = instructions.SKIP;
const STOP = instructions.STOP;

module.exports = {
    map: (mapper) => {
        return (atomicValueMonad, index) => [atomicValueMonad.then((val) => mapper(val, index))]
    },
    filter: (predicate) => {
        return (atomicValueMonad, index) => [
            atomicValueMonad.then((val) => {
                return predicate(val, index) ? val : SKIP;
            })
        ]
    },
    skip: (number) => {
        return (atomicValueMonad, index) => [
            atomicValueMonad.then((val) => {
                return index >= number ? val : SKIP;
            })
        ]
    },
    skipWhile: (predicate) => {
        return (atomicValueMonad, index) => [
            atomicValueMonad.then((val) => {
                return predicate(val, index) ? SKIP : val;
            })
        ]
    },
    take: (number) => {
        return (atomicValueMonad, index) => [
            atomicValueMonad.then((val) => {
                return index >= number ? STOP : val;
            })
        ]
    },
    takeWhile: (predicate) => {
        return (atomicValueMonad, index) => [
            atomicValueMonad.then((val) => {
                return predicate(val, index) ? val : STOP;
            })
        ]
    },
    flatMap: () => {
        return collection => collection;
    }
};
