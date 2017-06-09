'use strict';

const CompletionMonad = require('./completion-monad');

function wrapCallback (itemCallback) {
    return (context) => {
        const result = CompletionMonad.resolve(itemCallback(context));
        return result.then(continuation => {
             return {continuation, synchronous: result.synchronous};
        });
    };
}

//Iterator must be started.
function visit (iterator, itemCallback, context = {index: 0}, transform = null) {
    let n = 0;
    let looping = true;
    const callback = wrapCallback(itemCallback);
    do {
        const current = iterator.next();
        if (current.skip) {
            continue;   //eslint-disable-line no-continue
        }
        if (current.breakLoop) {
            return;
        }

        n = n + 1;
        const completion = CompletionMonad.resolve(current.Value);
        const currentContext = Object.assign({}, context, {index: context.index + n, value: completion});
        if (transform) {
            visit(transform(completion), itemCallback, currentContext);
        } else {
            callback(currentContext)
                .then(action => {
                    if (!action.continuation) {
                        looping = false;
                    } else if (!action.synchronous) {
                        looping = false;
                        setTimeout(() => {
                            visit(iterator, itemCallback, currentContext, transform);
                        }, 0);
                    }
                });
        }
    } while (looping);
}

module.exports = visit;
