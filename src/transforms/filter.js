'use strict';

const CompletionMonad = require('../completion-monad');

module.exports = () => Object.assign({
    transformItem: (item, index, callback) => {
        return CompletionMonad.resolve(item)
            .then((value) => {
                return callback(value, index) ? [item] : [];
            });
    }
});
