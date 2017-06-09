'use strict';

const loop = require('./loop');
const completionMonad = require('./completion-monad');

function handleTransformResult (result) {
    switch (result.action) {
        case loop.keepLooping: {
            const res = result.startInnerLoop(result.value);
            console.log(require('util').inspect(res));
            return res;
        }
        case loop.async:
            
            return result;
    }
    return result;
}

function visit (iterator, transforms, callback) {
    function loopItemCallback (context) {
        const actions = {
            continueLoop: context.continueLoop,
            continueAsyncLoop: context.continueAsyncLoop,
            breakLoop: context.breakLoop,
            returnLoop: context.returnLoop,
            startInnerLoop: context.startInnerLoop
        };
        const item = context.value.next();
        if (item.done) {
            return context.breakLoop();
        }
        if (transforms.length === 0) {
            callback(item.value, context.index);
            return context.continueLoop();
        }
        return handleTransformResult(transforms[0](item.value, context.index, actions));
    }

    return loop(iterator, loopItemCallback);
}

module.exports = {
    over: (iterable, transforms, callback) =>
        visit(iterable[Symbol.iterator](), transforms, callback),
    await: loop.async
};
