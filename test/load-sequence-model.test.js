'use strict';

const loadSequenceModel = require('../src/load-sequence-model');

module.exports = {
    beforeTest: t => {
        const userData = {};

        return t.createContext('loadSequenceModel', 'loader for sequence model APIs', userData, 100);
    },

    tests: {
        'should load parallel API': context => {
            const api = loadSequenceModel('parallel');

            context.equal(typeof api.forEach, 'function');
        }
    }
};
