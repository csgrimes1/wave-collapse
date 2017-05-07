'use strict';

const itemTransform = require('../src/item-transform');
const mappingTransform = () => item => [item * 2];
const filterTransform = () => item => item === isFinite || item % 2 === 1 ? [item] : [];
const flattenTransform = () => item => item;

module.exports = {
    beforeTest: t => {
        return t.createContext('item transforms', 'functional composition over an iteration', null, 1000/*timeout/ms*/);
    },

    tests: {
        'filter/map': context => {
            const ar = Array.from(itemTransform([1, 2, 3, 4], [filterTransform, mappingTransform]));

            context.deepEqual(ar, [2, 6]);
        },

        'flatten/filter': context => {
            const ar = Array.from(itemTransform([[9, 20, 21], [15, 18], [[45, 101]]], [flattenTransform, filterTransform]));

            context.deepEqual(ar, [9, 21, 15]);
        },

        'empty transform list': context => {
            const inputArray = [5, 6, 7];
            const ar = Array.from(itemTransform(inputArray, []));

            context.deepEqual(ar, inputArray);
        }
    }
};
