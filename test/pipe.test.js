'use strict';

const pipe = require('../src/pipe');
const sinon = require('sinon');
const normalReceiver = {
    data: ['a', 'b', 'c', 'd'],
    calls: 0,
    onMessage: function (message, responses) {
        this.calls = this.calls + 1;
        if (this.data.length > 0) {
            if ((this.calls % 2) === 0) {
                return responses.callAgain;
            } else {
                const result = this.data[0];
                this.data = this.data.slice(1);
                return result;
            }
        } else {
            return responses.done;
        }
    },
    isDone: function () {
        return this.data.length <= 0
    },
    error: () => null
};
const errorGeneratingReceiver = Object.assign({}, normalReceiver, {
    onMessage: function () {
        this.calls = this.calls + 1;
        if (this.calls >= 2) {
            throw new Error('leaving this closure');
        }
        const result = this.data[0];
        this.data = this.data.slice(1);
        return result;
    }
});
const errorIndicatingReceiver = Object.assign({}, normalReceiver, {
    onMessage: function () {
        const result = this.data[0];
        this.data = this.data.slice(1);
        this.lastError = new Error('?');
        return result;
    },
    error: function () {
        return this.lastError;
    }
});

const iterate = require('../src/iterate');

module.exports = {
    beforeTest: t => {
        return t.createContext('pipe', 'async pipes', null, 2000/*timeout/ms*/);
    },

    tests: {
        'normal pipe conversation': context => {
            const standardIterable = pipe.createIterablePipe(Object.assign({}, normalReceiver));

            return iterate(standardIterable)
                .series()
                .forEach(() => {
                    return true;
                })
                .then(count => {
                    context.equal(count, normalReceiver.data.length, 'should consume all data');
                });
        },

        // 'pipe receiver returns error': context => {
        //     const standardIterable = pipe.createIterablePipe(Object.assign({}, errorGeneratingReceiver));
        //     const catchSpy = sinon.spy();
        //     const countSpy = sinon.spy();
        //     return iterate(standardIterable)
        //         .series()
        //         .forEach(() => {
        //             countSpy();
        //             return true;
        //         })
        //         .catch(() => {
        //             catchSpy();
        //         })
        //         .then(() => {
        //             context.equal(countSpy.callCount, 1, 'counted one iteration');
        //             context.equal(catchSpy.callCount, 1, 'hit the catch block');
        //         });
        // },

        'pipe receiver indicates error through error() method': context => {
            const standardIterable = pipe.createIterablePipe(Object.assign({}, errorIndicatingReceiver));
            const catchSpy = sinon.spy();
            const countSpy = sinon.spy();
            return iterate(standardIterable)
                .series()
                .forEach(() => {
                    countSpy();
                    return true;
                })
                .catch(() => {
                    catchSpy();
                })
                .then(() => {
                    context.equal(countSpy.callCount, 1, 'should receive one iteration call');
                    context.equal(catchSpy.callCount, 1, 'should catch an error');
                });
        }
    }
};
