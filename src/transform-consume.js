'use strict';

const consume = require('./consume');
const stop = {stop: true};
const resumer = require('./resumer');

function transformOver (cardinalityMapper) {
    return function *(atom) {
        const expansion = cardinalityMapper(atom);
        //expect an iterable or iterator
        for (const item of expansion) {   //eslint-disable-line
            if (item === stop) {
                return;
            }
            yield item;
        }
    };
}

function makeMap (mapper) {
    return (item) => [mapper(item)];
}

function makeFilter (predicate) {
    return (item) => (predicate(item) ? [item] : []);   //eslint-disable-line
}

function makeAwaiter () {
    return makeMap((item) => resumer.resumeUpon(item));
}

function makeSkipper (maxCount) {
    let count = 0;
    return (item) => (count++ >= maxCount ? [item] : []);   //eslint-disable-line
}

function makeTaker (maxCount) {
    let count = 0;
    return (item) => (count++ < maxCount ? [item] : [stop]);   //eslint-disable-line
}

function collect (iterator, callback = () => true) {
    const result = [];
    const callbackWrapper = (item, index) => {
        console.log(`[${index}]: ${item}`)
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
    const walk = function *() {
        for (const item of target) {
            if (transformer) {
                yield* transformer(item);
            } else {
                yield item;
            }
        }
    };
    const iterator = Object.assign(walk(), {
        map: (mapper) => createRecursive(iterator, transformOver(makeMap(mapper))),
        filter: (predicate) => createRecursive(iterator, transformOver(makeFilter(predicate))),
        awaitEach: () => createRecursive(iterator, transformOver(makeAwaiter())),
        skip: (count) => createRecursive(iterator, transformOver(makeSkipper(count))),
        take: (count) => createRecursive(iterator, transformOver(makeTaker(count))),
        flatten: () => createRecursive(iterator, transformOver(items => items)),

        collect: (callback) => collect(iterator, callback)
    });

    return iterator;
}

module.exports = function create (collection) {
    return createRecursive(collection);
};
