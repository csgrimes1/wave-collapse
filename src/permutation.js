'use strict';

const lazyApiFactory = require('./lazy-api-factory');
const standardTransforms = require('./standard-transforms');
const defaultLazyApi = lazyApiFactory(standardTransforms);

module.exports = function startPermutation (iterad, lazyApi = defaultLazyApi) {
    function compose (previous, current) {
        const currentReplayable = Array.from(lazyApi.iterateOver(current));
        return lazyApi.iterateOver(previous).map(stack =>
            lazyApi.iterateOver(currentReplayable).map(item =>
                stack.concat([item]))
        )
            .flatten();

    }
    function build (composer) {
        const composition = composer();
        const result = {
            with: function (other) {
                return build(() => compose(composition, other));
            },
            filter: function (predicate) {
                const spreadicate = function (ar) {
                    return predicate.apply(null, ar);
                };

                return build(() => composition.filter(spreadicate));
            }
        };
        return Object.assign({}, lazyApi.iterateOver(composition), result);
    }
    return build(() => compose([[]], iterad));
};
