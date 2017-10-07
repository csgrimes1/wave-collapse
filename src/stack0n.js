'use strict';

const completionMonad = require('./completion-monad');

function *transformZeroN (valMonad, transformer) {
    const resolver = (atom) => completionMonad.resolve(atom);
    for (const atom of transformer(valMonad)) {
        yield resolver(atom);
    }
}

module.exports = {
    //value: any; zeroNTTransform: iterable creating 0..n results from value monad.
    //Returns an iterable of completion monads.
    transform: (value, zeroNTransform) => {
        return transformZeroN(completionMonad.resolve(value), zeroNTransform);
    }
};
