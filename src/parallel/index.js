'use strict';

/*eslint-disable global-require*/

const camelCase = require('../camel-case'),
    pairs = ['filter', 'for-each', 'gather', 'map', 'skip', 'take']
        .map(name => {
            const module = require(`./${name}`),
                camelName = camelCase(name);

            return typeof module === 'function'
                ? {[camelName]: module}
                : {[`${camelName}Module`]: module};
        });

module.exports = Object.assign.apply(null, pairs);
