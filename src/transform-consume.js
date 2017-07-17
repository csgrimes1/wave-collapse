'use strict';

const consume = require('./consume');
const stop = {stop: true};
const resumer = require('./resumer');

function transformOver (cardinalityMapper) {
    const result = {
        callback: function *(atom, index) {
            const expansion = cardinalityMapper(atom, index);
            //expect an iterable or iterator
            for (const item of expansion) {   //eslint-disable-line
                    console.log(require('util').inspect(item)) //eslint-disable-line
                if (item === stop) {
                    result.done = true;
                    return;
                }
                yield item;
            }
        },
        done: false
    };

    return result;
}

function makeMap (mapper) {
    return (item, index) => [mapper(item, index)];
}

function makeFilter (predicate) {
    return (item, index) => (predicate(item, index) ? [item] : []);   //eslint-disable-line
}

function makeAwaiter () {
    return makeMap((item) => resumer.resumeUpon(item));
}

function makeSkipWhile (predicate) {
    return (item, index) => (predicate(item, index) ? [] : [item]);   //eslint-disable-line
}

function makeSkipper (maxCount) {
    let count = 0;
    return makeSkipWhile(() => count++ < maxCount);
}

function makeTakeWhile (predicate) {
    return (item, index) => (predicate(item, index) ? [item] : [stop]);   //eslint-disable-line
}

function makeTaker (maxCount) {
    return (item, index) => {
        //We want to prevent the next round if we know this is the end of what we requested.
        if (index === maxCount - 1) {
            return [item, stop];
        } else if (index < maxCount) {
            return [item];
        }
        return [stop];
    };
}

function reduce (iterator, accumulator, initialValue) {
    let result = initialValue;
    return iterator.collect((val, index) => {
            result = accumulator(result, val, index);
            return true;
        })
        .then(() => result);
}

function collect (iterator, callback = () => true) {
    const result = [];
    const callbackWrapper = (item, index) => {
        if (!callback(item, index)) {
            return false;
        }
        result.push(item);
        return true;
    };

    return consume(iterator, callbackWrapper)
        .then(() => result);
}

function createRecursive (target, transformer) {
    let returned = 0;
    const walk0 = function *() {
        for (const item of target) {
            if (transformer) {
                yield* transformer.callback(item, returned);
                if (transformer.done) {
                    break;
                }
            } else {
                yield item;
            }
        }
    };
    const walk = function *() {
        for (const item of walk0()) {
            yield item;
            returned++;
        }
    };
    const iterator = Object.assign(walk(), {
        map: (mapper) => createRecursive(iterator, transformOver(makeMap(mapper))),
        filter: (predicate) => createRecursive(iterator, transformOver(makeFilter(predicate))),
        awaitEach: () => createRecursive(iterator, transformOver(makeAwaiter())),
        skip: (count) => createRecursive(iterator, transformOver(makeSkipper(count))),
        skipWhile: (predicate) => createRecursive(iterator, transformOver(makeSkipWhile(predicate))),
        take: (count) => createRecursive(iterator, transformOver(makeTaker(count))),
        takeWhile: (predicate) => createRecursive(iterator, transformOver(makeTakeWhile(predicate))),
        flatten: () => createRecursive(iterator, transformOver(items => items)),
        reduce: (accumulator, initialValue) => reduce(iterator, accumulator, initialValue),

        collect: (callback) => collect(iterator, callback)
    });

    return iterator;
}

module.exports = function create (collection) {
    return createRecursive(collection);
};
