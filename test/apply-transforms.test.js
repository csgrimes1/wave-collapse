'use strict';

const applyTransforms = require('../src/apply-transforms');
const sinon = require('sinon');
const awaitTransform = (value, index, actions) => actions.continueAsyncLoop(Promise.resolve([value]));
const mapTransform = (value, index, actions) => actions.continueLoop([value + 50]);
const filterTransform = (value, index, actions) => {
    return actions.continueLoop(value % 2 === 0 ? [value] : []);
};
const stopTransform = (value, index, actions) => {
    return value > 3 ? actions.breakLoop() : actions.continueLoop([value]);
};
const skipTransform = (value, index, actions) => {
    console.log(`skipping #${index}`)
    return actions.continueLoop(index > 3 ? [value] : []);
};
const takeTransform = (value, index, actions) => {
    console.log(`taking [${index}]: ${value}`)
    return value > 100 ? actions.returnLoop() : actions.continueLoop([value]);
};

const generate = function *() {
    for (let n=0; n < 150; n++) {
        console.log(`generating =============> ${n}`)
        yield n;
    }
};

module.exports = {
    beforeTest: t => {
        return t.createContext('apply-transforms', 'transform over an iteration', null, 1000/*timeout/ms*/);
    },

    tests: {
        'skip! simple consumption': context => {
            const spy = sinon.spy();
            const iterable = [1, 2, 3, 4, 5];
            applyTransforms.over(iterable, [], (value, index) => {
                context.equal(value, index + 1);
                spy();
                return true;
            });
            context.equal(spy.callCount, iterable.length);
        },
        'skip! map consumption': context => {
            const spy = sinon.spy();
            const iterable = [1, 2, 3, 4, 5];
            applyTransforms.over(iterable, [mapTransform], (value, index) => {
                context.equal(value, index + 101);
                spy();
                return true;
            });
            context.equal(spy.callCount, iterable.length);
        },
        'skip! filter consumption': context => {
            const spy = sinon.spy();
            const iterable = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            applyTransforms.over(iterable, [filterTransform], (value, index) => {
                context.equal(value, (index + 1) * 2);
                spy();
                return true;
            });
            context.equal(spy.callCount, Math.floor(iterable.length / 2));
        },
        'skip! stop transform': context => {
            const spy = sinon.spy();
            const iterable = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            applyTransforms.over(iterable, [stopTransform], (value, index) => {
                context.equal(value, index + 1);
                spy();
                return true;
            });
            context.equal(spy.callCount, 3);
        },
        'skip! skip transform': context => {
            const spy = sinon.spy();
            const iterable = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            applyTransforms.over(iterable, [skipTransform], (value, index) => {
                spy();
                return true;
            });
            context.equal(spy.callCount, 5);
        },
        'multiple transform': context => {
            const spy = sinon.spy();
            const iterable = [100, 101, 102];//{[Symbol.iterator]: generate};
            applyTransforms.over(iterable, [skipTransform, mapTransform, takeTransform, filterTransform], (value, index) => {
                spy();
                console.log(`----------------------------------> [${index}]: ${value}`)
                return true;
            });
            context.equal(spy.callCount, 10);
        },
        'skip! await consumption': context => {
            const spy = sinon.spy();
            const iterable = [1, 2, 3, 4, 5];
            applyTransforms.over(iterable, [awaitTransform], (value, index) => {
                context.equal(value, index + 1);
                spy();
                return true;
            });
            context.equal(spy.callCount, 0);
        }
    }
};
