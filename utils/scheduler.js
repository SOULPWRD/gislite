// scheduler.js
// Martin Pravda

/*jslint browser */

function make_scheduler(pool_size) {
    const pool = new Map(); 
    let is_paused = false;
    
    function schedule(callback) {
        if (pool.size > pool_size) {
            return;
        }

        if (is_paused === true) {
            pool.set(callback, undefined);
            return;
        }

        pool.set(callback, setTimeout(function () {
            callback(function () {
                pool.delete(callback);
            });
        }));
    }

    function pause() {
        is_paused = true;
        pool.forEach(function (ignore, key) {
            pool.set(key, undefined);
        });
    }

    function resume() {
        is_paused = false;
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

    function size() {
        return pool.size;
    }

    return Object.freeze({
        clear,
        is_full,
        pause,
        resume,
        schedule,
        size
    });
}

//demo const scheduler = make_scheduler(5);

//demo scheduler.pause();

//demo scheduler.schedule(function (next) {
//demo     console.log("A scheduled task 1");
//demo     next();
//demo });
//demo scheduler.schedule(function (next) {
//demo     console.log("A scheduled task 2");
//demo     next();
//demo });

//demo scheduler.size() === 2;

//demo scheduler.resume();
//demo scheduler.size() === 0;



export default Object.freeze(make_scheduler);