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
            with: (other) => build(result.visit(), other)
        };
        return result;
    }
    return build([[]], iterad);
};
