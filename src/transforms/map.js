'use strict';

const CompletionMonad = require('../completion-monad');

module.exports = () => Object.assign({
    transformItem: () => (item, index, callback) =>
        CompletionMonad.resolve(item)
            .then((value) => [callback(value, index)])
});
