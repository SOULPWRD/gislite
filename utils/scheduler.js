// scheduler.js
// Martin Pravda

/*jslint browser */

function make_scheduler(pool_size) {
    const pool = new Map();

    function schedule(callback) {
        if (pool.size > pool_size) {
            return;
        }

        pool.set(callback, setTimeout(function () {
            callback(function () {
                pool.delete(callback);
            });
        }));
    }

    function pause() {
        pool.forEach(function (ignore, key) {
            pool.set(key, undefined);
        });
    }

    function resume() {
        pool.forEach(function (ignore, callback) {
            schedule(callback);
        });
    }

    function is_full() {
        return pool.size === pool_size;
    }

    function clear() {
        pool.clear();
    }

    return Object.freeze({
        clear,
        is_full,
        pause,
        resume,
        schedule
    });
}

export default Object.freeze(make_scheduler);