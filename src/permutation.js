'use strict';

function *permuteWith (stack, iterad) {
    for (const item of iterad) {
        yield stack.concat([item]);
    }
}

module.exports = function startPermutation (iterad) {
    function build (previous, next) {
        const result = {
            visit: function *() {
                for (const stack of previous) {
                    yield* permuteWith(stack, next);
                }
            },
            with: (other) => build(result.visit(), other)
        };
        return result;
    }
    return build([[]], iterad);
};
