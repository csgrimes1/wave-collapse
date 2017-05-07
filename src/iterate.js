'use strict';

/*eslint-disable no-empty,global-require*/

const
    pair = (entry) => entry,
    valueOnly = (entry => entry[1]),
    typetester = require('./typetester'),
    loadSequenceModel = require('./load-sequence-model'),
    parallel = loadSequenceModel('parallel'),
    series = loadSequenceModel('series'),
    construct = (target) => {
        if (target === undefined) {
            return construct([]);
        } else if (target === null) {
        } else if (Object.hasOwnProperty(target.Symbol.iterator)) {
            return target[Symbol.iterator];
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
    tag = 'Iterator';

function completeIterator(innerObject, sequenceModel) {
    return Object.assign(innerObject, sequenceModel, {
        tag,
        internalApi: {
            reiterate: (generator) => startIterator(generator, sequenceModel)
        }
    });
}

function startIterator (iterator, sequenceModel) {
    const iterable = construct(iterator),
        result = {
            [Symbol.iterator]: iterable,
            series: () => startIterator(iterator, series),
            parallel: () => startIterator(iterator, parallel)
        };

    return completeIterator(result, sequenceModel);
}

function isModuleDefinedIterator (obj) {
    return obj && obj.tag === tag;
}

module.exports = function (target) {
    if (isModuleDefinedIterator(target)) {
        return target;
    }
    return startIterator(target, parallel);
};
