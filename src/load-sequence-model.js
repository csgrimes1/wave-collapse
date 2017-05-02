'use strict';

/*eslint-disable global-require*/

const camelCase = require('./camel-case');

module.exports = function loadSequenceModel (modelName) {
    const pairs = ['filter', 'for-each', 'gather', 'map', 'skip', 'take']
        .map(name => {
            const module = require(`./${modelName}/${name}`),
                camelName = camelCase(name);

            return typeof module === 'object'
                ? module
                : {[camelName]: module};
        });

    return Object.assign.apply(null, pairs);
};
