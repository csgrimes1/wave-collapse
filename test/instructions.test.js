'use strict';

const instructions = require('../src/instructions');
const completionMonad = require('../src/completion-monad');

module.exports = {
    beforeTest: t => {
        return t.createContext('instructions', 'skip/stop instructions', null, 10);
    },

    tests: {
        'should know a simple skip': context => {
            context.ok(instructions.shouldSkip(instructions.SKIP));
            context.ok(!instructions.shouldSkip(0));
        },
        'should know a monadic skip': context => {
            context.ok(instructions.shouldSkip(completionMonad.resolve(instructions.SKIP)));
            context.ok(!instructions.shouldSkip(completionMonad.resolve()));
        },
        'should know a simple stop': context => {
            context.ok(instructions.shouldStop(instructions.STOP));
        },
        'should know a monadic stop': context => {
            context.ok(instructions.shouldStop(completionMonad.resolve(instructions.STOP)));
        }
    }
};
