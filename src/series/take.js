'use strict';

function takeWhile (predicate, index) {
    console.log('quiewyroqiuweyrqoiwueryqioweyrqriueyeroiquyreoqiyuerwoiqur')
    const me = this,
        nexter = me
            .next()
            .then(result => {
                console.log('18937419384701923874019723409817234091734098170934170497823')
                if (result.breakLoop) {
                    return result;
                }
                if (predicate(result.value, index)) {
                    return result.value;
                }
                return takeWhile(predicate, index + 1);
            });
    return me.reiterate({next: nexter});
}

module.exports = {
    takeWhile: (predicate) => takeWhile(predicate, 0),
    take: (count) => takeWhile((val, index) => index < count)
};
