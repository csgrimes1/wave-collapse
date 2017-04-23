'use strict';

module.exports = function camelCase (name) {
    return name.replace(/-[a-z]/g, (token) => {
        return token.substr(1).toUpperCase();
    });
};
