'use strict';

const completionMonad = require('./completion-monad');

const action = {
    keepLooping: 0,
    stop: 1,
    async: 2
};

function createContext (initialValue, callback, whenDone) {
    return {
        callback,
        whenDone,
        index: 0,
        asyncCount: 0,
        value: initialValue,
        continueLoop: function (value) {
            return Object.assign({}, this, {
                index: this.index + 1,
                action: action.keepLooping,
                value
            });
        },
        continueAsyncLoop: function (promise) {
            return Object.assign({}, this, {
                index: this.index + 1,
                asyncCount: this.asyncCount + 1,
                action: action.async,
                value: promise
            });
        },
        breakLoop: function (result) {
            const resumeContext = this.resumeContext || {};
            return Object.assign({}, this, resumeContext, {
                action: this.resumeContext
                    ? this.asyncCount ? action.async : action.keepLooping
                    : action.stop,
                value: result === undefined ? this.value : result,
                asyncCount: this.asyncCount + (resumeContext.asyncCount || 0),
                index: resumeContext.index || this.index,
                resumeContext: undefined,
                whenDone
            });
        },
        returnLoop: function (result) {
            return {
                index: this.index,
                asyncCount: this.asyncCount,
                action: action.stop,
                value: result === undefined ? this.value : result,
                resumeContext: undefined,
                whenDone
            };
        },
        startInnerLoop: function (initialValue) {
            return Object.assign({}, createContext(initialValue), this, {
                resumeContext: this,
                value: initialValue,
                asyncCount: 0,
                callback
            });
        }
    };
}

function basicLoop (initialContext) {
    let context = initialContext;
    while (true) {
        context = context.callback(context);
        if (context.action === action.stop) {
            break;
        } else if (context.action === action.async) {
            context.value.then(result => {
                    //Get a simple value rather than a promise in what we pass on
                    const newContext = Object.assign({}, context, {value: result});
                    basicLoop(newContext);
                })
                .catch(x => {
                    context.whenDone(x);
                });
            return;
        }
    }
    context.whenDone(null, context);
}

module.exports = Object.assign(function loop (initialValue, callback) {
    return completionMonad.smartConstruction((resolve, reject) => {
        basicLoop(createContext(initialValue, callback, (error, finalContext) => {
            if (error) {
                reject(error);
            } else {
                resolve(finalContext.value);
            }
        }));
    });
}, action);
