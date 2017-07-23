'use strict';

const curry = require('../src/curry');
const sinon = require('sinon');
const uncurried = sinon.spy(() => {
});

module.exports = {
    beforeTest: t => {
        return t.createContext('curry', 'curry');
    },

    tests: {
        'curry away an argument': context => {
            const x = 'hello';
            const cf = curry(x, uncurried);
            cf('there');
            context.ok(uncurried.calledWith('hello', 'there'));
        }
    }
};
