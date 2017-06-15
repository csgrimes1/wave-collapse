'use strict';

const transformConsume = require('./transform-consume');

function *permuteWith (stack, iterad) {
    for (const item of iterad) {
        yield stack.concat([item]);
    }
}

module.exports = function startPermutation (iterad) {
    function build (previous, next) {
        const rawVisit = function *() {
            for (const stack of previous) {
                yield* permuteWith(stack, next);
            }
        };

        const result = {
            visit: () => transformConsume(rawVisit()),
            with: function (other) {
                return build(this.visit(), other);
            },
            filter: function (predicate) {
                const selfie = this;
                const spreadicate = function (ar) {
                    return predicate.apply(selfie, ar);
                };
                return Object.assign({}, this, {
                    visit: () => selfie.visit().filter(spreadicate)
                })
            }
        };
        return result;
    }
    return build([[]], iterad);
};
