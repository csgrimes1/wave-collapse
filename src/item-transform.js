'use strict';

function createItemTransformer (transforms) {
    let index = 0;
    if (transforms.length <= 0) {
        return (item) => [item];
    }

    const recurseThru = function *(item, createTransform, nextTransforms) {
        const transform = createTransform();
        for (const result of transform(item, index++)) {
            if (nextTransforms.length <= 0) {
                yield result;
            } else {
                yield* recurseThru(result, nextTransforms[0], nextTransforms.slice(1));
            }
        }
    };
    return function *(item) {
        yield* recurseThru(item, transforms[0], transforms.slice(1));
    };
}

module.exports = function *(iterable, transforms) {
    const xform = createItemTransformer(transforms);
    for (const item of iterable) {
        yield* xform(item);
    }
};
