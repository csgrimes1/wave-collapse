'use strict';

const syncPromise = require('../src/sync-promise'),
    sinon = require('sinon');

module.exports = {
    beforeTest: t => {
        return t.createContext('shortname', 'long description', null, 2000/*timeout/ms*/);
    },

    tests: {
        'resolve runs synchronously': context => {
            const spy = sinon.spy(),
                val = 1234,
                catchSpy = sinon.spy();

            syncPromise.resolve(val)
                .then(result => {
                    spy();
                    context.equal(result, val, 'should result in passed value');
                })
                .catch(() => {
                    catchSpy();
                });
            context.ok(spy.called, 'then spy called');
            context.ok(!catchSpy.called, 'catch spy not called');
        },
        'reject runs synchronously': context => {
            const spy = sinon.spy(),
                val = new Error('what');

            syncPromise.reject(val)
                .catch(result => {
                    spy();
                    context.equal(result, val, 'should result in passed value');
                });
            context.ok(spy.called, 'catch spy was called');
        },
        'reject with error in callback runs synchronously': context => {
            const catch1spy = sinon.spy(),
                err1 = new Error('what'),
                err2 = new Error('bad');

            syncPromise.reject(err1)
                .catch(result => {
                    catch1spy();
                    context.equal(result, err1, 'should result in passed value');
                    throw err2;
                })
                .catch(x => {
                    context.equal(x, err2, 'should receive second error');
                });
            context.ok(catch1spy.called, 'catch 1 spy was called');
        },
        'reject runs synchronously and skips .then callback': context => {
            const thenSpy = sinon.spy(),
                catchSpy = sinon.spy(),
                val = new Error('what');

            syncPromise.reject(val)
                .then(() => {
                    thenSpy();
                })
                .catch(result => {
                    catchSpy();
                    context.equal(result, val, 'should result in passed value');
                });
            context.ok(catchSpy.called, 'catch spy called');
            context.ok(!thenSpy.called, 'then spy not called');
        },
        'error in then callback results in catch': context => {
            const thenSpy = sinon.spy(),
                catchSpy = sinon.spy(),
                e = new Error('err');

            syncPromise.resolve()
                .then(() => {
                    thenSpy();
                    throw e;
                })
                .catch(x => {
                    context.equal(x, e, 'should get thrown error');
                    catchSpy();
                });

            context.ok(thenSpy.called);
            context.ok(catchSpy.called);
        },
        'uses native promise when passed in': context => {
            const val = 2112,
                p = Promise.resolve(val),
                spy = sinon.spy(),
                pTest = syncPromise.resolve(p)
                    .then(result => {
                        spy();
                        context.equal(result, val, 'should get passed value');
                    });
            context.ok(!spy.called, 'spy not called synchronously');
            return pTest
                .then(() => {
                    context.ok(spy.called, 'spy called asynchronously');
                });
        },
        'uses native promise when passed for rejection': context => {
            const err = new Error('bad'),
                p = Promise.reject(err),
                spy = sinon.spy(),
                thenSpy = sinon.spy(),
                pTest = syncPromise.reject(p)
                    .then(() => {
                        thenSpy();
                    })
                    .catch(result => {
                        spy();
                        context.equal(result, err, 'should get passed value');
                    });
            context.ok(!spy.called, 'spy not called synchronously');
            return pTest
                .then(() => {
                    context.ok(!thenSpy.called, 'then callback untouched');
                    context.ok(spy.called, 'spy called asynchronously');
                });
        },
        'attempt resolves to a promise': context => {
            return syncPromise.attempt(() => {})
                .then(() => {
                    context.ok(true);
                })
                .catch(() => {
                    context.ok(false);
                });
        },
        'attempt rejects on an error': context => {
            return syncPromise.attempt(() => {
                throw new Error();
            })
                .then(() => {
                    context.ok(false);
                })
                .catch(() => {
                    context.ok(true);
                });
        },
        'smartConstruction can return a synchronous promise': context => {
            const testValue = 5150,
                p = syncPromise.smartConstruction((resolve) => {
                    resolve(testValue);
                });

            context.equal(p.status, 0);
            context.equal(p.value, testValue);
        },
        'smartConstruction can return an asynchronous promise': context => {
            const testValue = 2112,
                p = syncPromise.smartConstruction((resolve) => {
                    setTimeout(() => {
                        resolve(testValue);
                    }, 0);
                });

            context.equal(p.status, undefined);
            context.equal(p.value, undefined);

            return p.then(val => {
                context.equal(val, testValue);
            });
        },
        'smartConstruction can reject synchronously': context => {
            const testValue = 888,
                p = syncPromise.smartConstruction((__, reject) => {
                    reject(testValue);
                });

            context.equal(p.status, 1);
            context.equal(p.error, testValue);
        },
        'smartConstruction can reject asynchronously': context => {
            const testValue = 888,
                p = syncPromise.smartConstruction((__, reject) => {
                    setTimeout(() => {
                        reject(testValue);
                    }, 0);
                });

            context.equal(p.status, undefined);
            context.equal(p.error, undefined);
            return p.then(() => {
                    throw new Error('should not be called');
                })
                .catch(x => {
                    context.equal(x, testValue);
                });
        },

        'cannot alter a promise result': context => {
            const testValue = 2112,
                p = syncPromise.smartConstruction(resolve => {
                    resolve(testValue);
                    resolve(testValue + 1);
                });

            context.equal(p.value, testValue);
        },

        'cannot alter a promise reject': context => {
            const testValue = 55,
                p = syncPromise.smartConstruction((_, reject) => {
                    reject(testValue);
                    reject(testValue + 1);
                });

            context.equal(p.error, testValue);
        },

        'can atomize a SyncPromise': context => {
            const testValue = 12345,
                spToValue = syncPromise.resolve(testValue);
            return syncPromise.resolve(spToValue)
                .then(result => {
                    context.equal(result, testValue);
                });
        }
    }
};
