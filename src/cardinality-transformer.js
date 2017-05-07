'use strict';

const iterate = require('iterate');

module.exports = function createTransformer(iterator, actionCallback) {
    return {
        innerNext: function (responseCodes) {
            const current = this.currentItem.iterator.next();
            return current.done
                ? responseCodes.callAgain
                : actionCallback(current.value, responseCodes);
        },
        completed: false,
        currentItem: null,
        onMessage: function (message, responseCodes) {
            if (!this.currentItem) {
                this.currentItem = iterator.next();
                if (this.currentItem.done) {
                    this.completed = true;
                    return responseCodes.callAgain;
                }
                this.currentItem.iterator = iterate(this.currentItem.value);
            }
            return this.innerNext(responseCodes);
        },
        error: () => null,
        isDone: function () {
            return this.completed;
        }
    }
};
