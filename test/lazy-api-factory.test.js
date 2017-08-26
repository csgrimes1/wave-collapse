'use strict';

const lazyApiBuilder = require('../src/lazy-api-factory');
const ignoreMarker = {ignore: true};

function mapTransform (mapping) {
    return function *(atomicValueMonad, index) {
        yield atomicValueMonad.then((val) => mapping(val, index));
    };
}
function ignoreSome (predicate) {
    return function (atomicValueMonad, index) {
        return [
            //Illustrates how we must always yield at least one outcome from every atom due to the
            //need to wait. We can use a well-known value to tell the visitor to ignore the yield
            //when we need later to filter the value out.
            atomicValueMonad.then((val) => {
                return predicate(val, index) ? val : ignoreMarker
            })
        ];
    }
}

const transforms = {
    mapTransform,
    ignoreSome
};
const lazySync = lazyApiBuilder(transforms);

module.exports = {
    beforeTest: t => {
        return t.createContext('lazy-api-builder', 'iterateOver an actual lazy iteration API sets of transforms and terminators');
    },

    tests: {
        'shallow iteration': (context) => {
            const ar = Array.from(lazySync.iterateOver([1, 2, 3]));
            const results = ar.map(monad => monad.value);
            context.deepEqual(results, [1, 2, 3]);
        },
        'sync API': (context) => {
            const ar = Array.from(lazySync.iterateOver([1, 2, 3])
                .mapTransform((value, index) => ({index, value})));
            const results = ar.map(monad => monad.value);
            context.deepEqual(results, [{index: 0, value: 1}, {index: 1, value: 2}, {index: 2, value: 3}]);
        },
        //Tests the basics of how filter will work.
        'ignoring yield semantics': (context) => {
            const predicate = val => (val % 2) === 0;
            const mapping = (val, index) => index;
            const operation = lazySync.iterateOver([null, null, null])
                .mapTransform(mapping)
                .ignoreSome(predicate);
            const ar = Array.from(operation);
            const results = ar.map(monad => monad.value);
            context.deepEqual(results, [0, ignoreMarker, 2]);
        },
        'async stacking deep': (context) => {
            const predicate = val => (val % 2) === 0;
            const mapping = (val, index) => Promise.resolve(index);
            const operation = lazySync.iterateOver([null, null, null])
                .mapTransform(mapping)
                .ignoreSome(predicate);
            const promises = Array.from(operation);
            context.ok(promises[0] instanceof Promise, 'should yield promises');
            return Promise.all(promises)
                .then(ar => {
                    context.deepEqual(ar, [0, ignoreMarker, 2]);
                });
        },
        'zero length async': (context) => {
            const operation = lazySync.iterateOver([])
                mapTransform(x => x);
            const ar = Array.from(operation);
            context.equal(ar.length, 0);
        },
        'deep reduce': (context) => {
            return lazySync.iterateOver([1, 2, 3])
                .mapTransform((value, index) => ({index, value}))
                .reduce((acc, value) => {
                    return acc + value.index + value.value;
                }, 1000)
                .then(result => {
                    context.equal(result, 1009);
                });
        },
        're-entrance': (context) => {
            const ar = [3, 4, 5];
            const first = lazySync.iterateOver(ar);
            const operation = lazySync.iterateOver(first);
            const result = Array.from(operation);
            context.equal(result.length, ar.length);
            context.deepEqual(result.map(r => r.value), ar);
        }
    }
};
