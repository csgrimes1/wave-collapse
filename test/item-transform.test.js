'use strict';

const itemTransform = require('../src/item-transform');
const mappingTransform = () => item => [item * 2];
const filterTransform = () => item => item === isFinite || item % 2 === 1 ? [item] : [];
const flattenTransform = () => item => item;
const endTransform = (collection) => function *() {
    console.log(`collection: ${collection}`)
    for (const member of collection) {
        if (member <= 100) {
            yield member;
        } else {
            return;
        }
    }
};

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
        },

        'endcap support': context => {
            const gen = function *() {
                for (let n = 95; n < 180; n++) {
                    yield n;
                }
            };
            const ar = Array.from(itemTransform(gen(), [filterTransform, endTransform, mappingTransform]));

            context.deepEqual(ar, [95, 97, 99]);
        }
    }
};
