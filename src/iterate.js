'use strict';

/*eslint-disable no-empty,global-require*/

const
    pair = (entry) => entry,
    valueOnly = (entry => entry[1]),
    typetester = require('./typetester'),
    parallel = require('./parallel'),
    series = {
        takeModule: null,
        forEach: require('./series/for-each'),
        gather: require('./series/gather')
    },
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
    tag = 'Iterator';

// function series (iterator) {
//     let index = -1;
//
//     console.log(`===> iterator: ${JSON.stringify(iterator)}`)
//
//     return function driver (callback, predicate) {
//         index++;
//         const current = iterator.next();
//
//         if (current.done) {
//             callback(doneValue);
//         } else {
//             Promise.resolve(current.value)
//                 .then(value => {
//                     if (predicate(value, index)) {
//                         callback({value, index: index, valid: true});
//                         driver(callback, predicate);
//                     } else {
//                         callback(doneValue);
//                     }
//                 })
//                 .catch(x => {
//                     callback(Object.assign({}, doneValue, x));
//                 });
//         }
//     }
// }
//
// function parallel (iterator) {
//     let index = -1;
//
//     return recursive((callback, predicate, recurse) => {
//         index++;
//         const current = iterator.next();
//
//         if (current.done) {
//             callback(doneValue);
//         } else if (predicate(current.value, index)) {
//             try {
//                 callback({value: current.value, index: index, valid: true});
//             } catch (x) {
//                 callback(Object.assign({}, doneValue, x));
//                 return;
//             }
//
//             return recurse(callback, predicate);
//         }
//     });
// }
//
// function makeVisitor (iterator, processor) {
//     return processor(iterator);
// }

function completeIterator(innerObject, sequenceModel) {
    //const visit = makeVisitor(innerObject, sequenceModel);

    return Object.assign(innerObject, {
        //visit: (callback, predicate = () => true) => visit(callback, predicate),
        map: sequenceModel.map,
        filter: sequenceModel.filter,
        skip: sequenceModel.skipModule.skip,
        skipWhile: sequenceModel.skipModule.skipWhile,
        take: sequenceModel.takeModule.take,
        takeWhile: sequenceModel.takeModule.takeWhile,
        forEach: sequenceModel.forEach,
        gather: sequenceModel.gather,
        tag,
        internalApi: {
            //wrapIterator: (newIterator, predicate) => wrapIterator(newIterator, sequenceModel, predicate),
            reiterate: (generator) => startIterator(generator, sequenceModel)
        }
    });
}

function startIterator (iterator, sequenceModel) {
    const iterable = construct(iterator),
        //rawIterator = iterable(),
        result = {
            ///next: () => rawIterator.next(),

            [Symbol.iterator]: iterable,
            series: () => startIterator(iterator, series),
            parallel: () => startIterator(iterator, parallel)
        };

    return completeIterator(result, sequenceModel);
}

// function wrapIterator (inner, sequenceModel, predicate) {
//     return completeIterator(Object.assign({}, inner, {
//         next: () => inner.next(),
//         tag,
//         series: () => wrapIterator(inner, series),
//         parallel: () => wrapIterator(inner, parallel)
//     }), sequenceModel, predicate);
// }

function isModuleDefinedIterator (obj) {
    return obj && obj.tag === tag;
}

module.exports = function (target) {
    if (isModuleDefinedIterator(target)) {
        return target;
    }
    // if (typeof target === 'function') {
    //     //If it's a producer function, wrap it.
    //     return wrapIterator({produce: target}, parallel);
    // }
    return startIterator(target, parallel);
};
