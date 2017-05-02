'use strict';

const pipe = require('../src/pipe');
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
                .forEach((item, index) => {
                    console.log(`item[${index}]: ${item}`)
                    return true;
                })
                .then(count => {
                    context.equal(count, normalReceiver.data.length, 'should consume all data');
                });
        }
    }
};
