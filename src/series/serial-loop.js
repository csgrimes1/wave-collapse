'use strict';

const defaultPredicate = () => true;
const doneValue = Symbol.done;

module.exports = function serialLoop (iterable, callback, predicate = defaultPredicate, continuationPredicate = defaultPredicate) {
    const iterator = iterable[Symbol.iterator](),
        callbackWrapper = (val, index) => {
            return callback(val, index);
        },
        nullCallback = () => {};

    return new Promise((resolve, reject) => {
        visit(0, iterator, callbackWrapper, predicate, continuationPredicate, (reason) => {
            resolve(reason);
        }, (error) => {
            reject(error);
        }, nullCallback, nullCallback, nullCallback)
    });
};

function visit (index, iterator, callback, predicate, continuationPredicate, doneCallback, errorCallback) {
    try {
        const result = iterator.next();

        if (result.done) {
            doneCallback();
            return;
        }
        const moveForward = () => setTimeout(() => {
            visit(index + 1, iterator, callback, predicate, continuationPredicate, doneCallback, errorCallback);
        }, 0);

        Promise.resolve(result.value)
            .then(val => {
                if (val === doneValue) {
                    doneCallback();
                    return;
                }
                if (!continuationPredicate(val, index)) {
                    doneCallback('predicated');
                    return;
                }
                if (predicate(val, index)) {
                    callback(val, index);
                }
                moveForward();
            })
            .catch(x => {
                errorCallback(x);
                throw x;
            });
    } catch (x) {
        console.error(`sync visit catch block: ${x.stack}`);
        errorCallback(x);
    }
}


function wrapIterator (iteratorStateMachine) {
    return {
        next: function() {
            if (iteratorStateMachine.done) {
                return iteratorStateMachine;
            }
            return Object.assign({},
                iteratorStateMachine,
                {
                    value: iteratorStateMachine.gate.promise
                }
            );
        },
        [Symbol.iterator]: function () {
            return this;
        }
    };
}

module.exports.asIterator = function (iterable, predicate = defaultPredicate, continuationPredicate = defaultPredicate) {
    let iteratorStateMachine = {
        done: false,
        gate: defer()
    };
    const doneCallback = () => {
        iteratorStateMachine.done = true;
        delete iteratorStateMachine.value;
        iteratorStateMachine.gate.resolve(doneValue);
    };
    const errorCallback = (x) => {
        iteratorStateMachine.done = true;
        delete iteratorStateMachine.value;
        iteratorStateMachine.error = x;
        iteratorStateMachine.gate.resolve(doneValue);
    };
    const itemCallback = (val, index) => {
        iteratorStateMachine.value = val;
        iteratorStateMachine.index = index;
        iteratorStateMachine.done = false;
        const oldDefer = iteratorStateMachine.gate;
        iteratorStateMachine.gate = defer();
        oldDefer.resolve(val);
    };

    visit(0, iterable[Symbol.iterator](), itemCallback, predicate, continuationPredicate, doneCallback, errorCallback);
    if (iteratorStateMachine.error) {
        throw iteratorStateMachine.error;
    }
    const newIterator = wrapIterator(iteratorStateMachine);
    return iterable.internalApi.reiterate(newIterator);
};
