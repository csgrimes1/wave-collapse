'use strict';

const completionMonad = require('./completion-monad');

function *transformZeroN (valMonad, index, transformer, monadResolver) {
    for (const atom of transformer(valMonad, index)) {
        yield monadResolver(atom);
    }
}

module.exports = {
    //value: any; zeroNTTransform: iterable creating 0..n results from value monad.
    //Returns an iterable of completion monads.
     transform: (value, index, zeroNTransform, synchronous = true) => {
        const resolver = synchronous
            ? (atom) => completionMonad.resolve(atom)
            : (atom) => Promise.resolve(atom).then(result => completionMonad.resolve(result));
        return transformZeroN(completionMonad.resolve(value), index, zeroNTransform, resolver);
    }
};
