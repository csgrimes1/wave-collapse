'use strict';

module.exports = () => (item, index, callback) => {
    return callback(item, index) ? [item] : []
};
