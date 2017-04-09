'use strict';

/*eslint-disable no-empty*/

const recursive = require('./recursive'),
    synchPromise = require('./sync-promise'),
    pair = (entry) => entry,
    valueOnly = (entry => entry[1]),
    filter = require('./filter'),
    typetester = require('./typetester'),
    skipModule = require('./skip'),
    takeModule = require('./take'),
    forEach = require('./for-each'),
    gather = require('./gather'),
    construct = (target) => {
        if (target === undefined) {
            return construct([]);
        } else if (target === null) {
        } else if (typetester.isIterator(target)) {
            return function *() {
                for (const x of target) {
                    yield x;
                }
            };
        } else if (typeof target.entries === 'function') {
            const entryMapper = target instanceof Map ? pair : valueOnly;

            return function *() {
                for (const pair of target.entries()) {
                    yield entryMapper(pair);
                }
            };
        } else if (typetester.isPromise(target)) {
        } else if (typeof target === 'object') {
            return function *() {
                for (const k of Object.getOwnPropertyNames(target)) {
                    yield [k, target[k]];
                }
            };
        }
        return construct([target]);
    },
    doneValue = Object.freeze({valid: false}),
    tag = 'Iterator';

function makeVisitor (target, processor, predicate = () => true) {
    const driver = recursive((callback, recurse) => {
        let resultingPromise;
        let continuation;
        const innerCallback = (value, index, atLastItem) => {
            resultingPromise = processor(value, index, callback, predicate)
                .then(continueFlag => {
                    continuation = atLastItem ? false : continueFlag;
                    return continuation;
                });
        };

        //This will invoke the visitor callback.
        target.produce(innerCallback);
        //Everything from here on is either navigation or signaling done/error.
        if (continuation) {
            //We know the promise resolved synchronously!
            return recurse(callback);
        } else if (continuation === false) {
            callback(doneValue);
        } else if (resultingPromise) {
            resultingPromise.then(continueFlag => {
                if (continueFlag) {
                    setTimeout(() => driver(callback), 0);
                } else {
                    callback(doneValue);
                }
            })
                .catch(x => {
                    callback(Object.assign({}, doneValue, x));
                });
        } else {
            callback(doneValue);
        }
    });

    return driver;
}

function parallel (value, index, callback, predicate) {
    if (!predicate(value, index)){
        //This continues without hitting the callback
        return synchPromise.resolve(true);
    }
    return synchPromise.attempt(() => callback({value, index: index, valid: true}));
}

function series (value, index, callback, predicate) {
    if (typetester.isPromise(value)) {
        return value.then(result => {
            if (!predicate(value, index)) {
                //Continue on without talking to callback.
                return true;
            }

            return callback({value: result, index, valid: true});
        });
    } else {
        return parallel(value, index, callback, predicate);
    }
}

function makeIteratorProducer (it) {
    const generator = it();
    let index = 0,
        next = generator.next();

    return (callback) => {

        if (next.done) {
            return false;
        } else {
            const val = next.value;

            next = generator.next();
            return callback(val, index++, next.done);
        }
    };
}

function completeIterator(innerObject, callbackProcessor, predicate) {
    const visit = makeVisitor(innerObject, callbackProcessor, predicate);

    return Object.assign(innerObject, {
        visit,
        filter,
        skip: skipModule.skip,
        skipWhile: skipModule.skipWhile,
        take: takeModule.take,
        takeWhile: takeModule.takeWhile,
        forEach,
        gather,
        tag,
        internalApi: {
            wrapIterator: (newIterator, predicate) => wrapIterator(newIterator, callbackProcessor, predicate)
        }
    });
}

function startIterator (target, callbackProcessor) {
    const rawIterator = construct(target),
        produceMethod = makeIteratorProducer(rawIterator),
        result = {
            produce: produceMethod,

            [Symbol.iterator]: rawIterator,
            series: () => startIterator(target, series),
            parallel: () => startIterator(target, parallel)
        };

    return completeIterator(result, callbackProcessor);
}

function wrapIterator (inner, callbackProcessor, predicate) {
    const effectiveInner = typeof inner === 'function' ? {produce: inner} : inner;

    return completeIterator(Object.assign({}, effectiveInner, {
        tag,
        series: () => wrapIterator(inner, series),
        parallel: () => wrapIterator(inner, parallel)
    }), callbackProcessor, predicate);
}

function isModuleDefinedIterator (obj) {
    return obj && obj.tag === tag;
}

module.exports = function (target) {
    if (isModuleDefinedIterator(target)) {
        return wrapIterator(target, parallel);
    }
    if (typeof target === 'function') {
        //If it's a producer function, wrap it.
        return wrapIterator({produce: target}, parallel);
    }
    return startIterator(target, parallel);
};
