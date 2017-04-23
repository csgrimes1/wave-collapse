'use strict';

const iterate = require('../src/iterate'),
    sinon = require('sinon'),
    bluebird = require('bluebird');

function checkResults (toIterateOver, expectedArray, context, descript) {
    return iterate(toIterateOver)
        .gather()
        .then(ar => {
            context.deepEqual(ar, expectedArray, descript);
        });
}

module.exports = {
    beforeTest: t => {
        const userData = {};

        return t.createContext('iterate', 'creation of iterators', userData, 5000/*timeout/ms*/);
    },

    tests: {
        'should create iterator for atomic value': context => {
            return checkResults(undefined, [], context)
                .then(() => checkResults(1, [1], context))
                .then(() => checkResults(true, [true], context))
                .then(() => checkResults(false, [false], context))
                .then(() => checkResults('test', ['test'], context))
                .then(() => checkResults(null, [null], context));
        },

        'should emit key/value pairs for Map': context => {
            const ar = [['a', 1], ['b', 2]],
                map = new Map(ar);

            return iterate(map)
                .gather(result => {
                    context.deepEqual(result, ar);
                });
        },

        'should emit key/value pairs for JSON object': context => {
            return iterate({a: 1, b: 3})
                .gather(ar => {
                    context.deepEqual(ar, [['a', 1], ['b', 3]]);
                });
        },
        'should iterate synchronously and visit all elements': context => {
            const ar = [1, 2, 3];
            let n = 0;
            iterate(ar).forEach((val, index) => {
                context.equal(val, index + 1, 'expected value');
                context.equal(index, n, 'expected index');
                n++;
                return true;
            });
            context.equal(n, ar.length, 'expected touches');
        },

        'skip!should support native promises': context => {
            const spy = sinon.spy();

            return iterate(Promise.resolve(200))
                .series()
                .forEach(val => {
                    context.equal(val, 200);
                    spy();
                    return true;
                })
                .then(() => {
                    context.ok(spy.called, 'got a callback');
                });
        },

        'skip!should support bluebird promises': context => {
            const spy = sinon.spy();

            return iterate(bluebird.resolve(200))
                .series()
                .forEach(val => {
                    context.equal(val, 200);
                    spy();
                    return true;
                })
                .then(() => {
                    context.ok(spy.called, 'got a callback');
                });
        },

        'skip!should iterate through with forEach': context => {
            const spy = sinon.spy();

            return iterate([Promise.resolve(2), bluebird.resolve(2), 2])
                .series()
                .forEach((val) => {
                    context.equal(val, 2);
                    spy();
                    return true;
                })
                .then(() => {
                    context.ok(spy.calledThrice, 'got a callback');
                });
        }
    }
};
