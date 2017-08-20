'use strict';

const lazyApiFactory = require('./lazy-api-factory');
const standardTransforms = require('./standard-transforms');
const defaultLazyApi = lazyApiFactory(standardTransforms);

module.exports = function startPermutation (iterad, lazyApi = defaultLazyApi) {
    function build (previous, current) {
        function explode (item) {
            return lazyApi.iterateOver(previous).map(stack => {
                const result = stack.concat([item]);
                console.log('stack + [item] =========>', result);//eslint-disable-line
                return result;
            });
        }
        const result = {
            iterateOver: () => lazyApi.iterateOver(current)
                .map(explode)
                .flatten(),
            with: function (other) {
                return build(result.iterateOver(), other);
            },
            filter: function (predicate) {
                const spreadicate = function (ar) {
                    return predicate.apply(result, ar);
                };
                return Object.assign({}, this, {
                    iterateOver: () => result.iterateOver().filter(spreadicate)
                })
            }
        };
        return result;
    }
    return build([[]], iterad);
};
