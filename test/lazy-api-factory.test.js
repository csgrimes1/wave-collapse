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

function simpleTerm(iterator) {
    return Array.from(iterator);
}

const transforms = {
    mapTransform,
    ignoreSome
};

const terminators = {
    simpleTerm
};
const lazySync = lazyApiBuilder(transforms, terminators);

module.exports = {
    beforeTest: t => {
        return t.createContext('lazy-api-builder', 'iterateOver an actual lazy iteration API sets of transforms and terminators');
    },

    tests: {
        'sync API': (context) => {
            const ar = Array.from(lazySync.iterateOver([1, 2, 3])
                .mapTransform((value, index) => ({index, value})));
            console.log(require('util').inspect(ar))//eslint-disable-line
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
        }
    }
};
