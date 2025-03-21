// scheduler.js
// Martin Pravda

// Scheduler is a module for scheduling asyncronous tasks
// based on the defined concurrency limit.
// It never processess more tasks concurrently than the given threshold.
// It has a capability to pause or resume the processing
// or completely prune scheduled tasks

/*jslint browser */

import make_queue from "./queue.js";

function make_scheduler(concurrency_limit) {

// "pool" is a map that keeps track of the running tasks

    const pool = new Map();

// queue is a place where all tasks come first. Scheduler automatically manages
// pulling the tasks from the queue into the processing pool.

    const queue = make_queue();
    let is_paused = false;

    function process(callback) {
        if (callback === undefined) {
            return;
        }

        if (is_paused === true) {
            pool.set(callback, undefined);
            return;
        }

        pool.set(callback, setTimeout(function () {
            callback(function () {
                pool.delete(callback);
                process(queue.pop());
            });
        }));
    }

    function schedule(callback) {
        queue.push(callback);

        if (pool.size > concurrency_limit - 1) {
            return;
        }

        process(queue.pop());
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
            process(callback);
        });
    }

    function is_full() {
        return pool.size === concurrency_limit;
    }

    function is_processing() {
        return pool.size > 0;
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
        is_processing,
        pause,
        resume,
        schedule,
        size
    });
}

//demo const scheduler = make_scheduler(5);

//demo scheduler.pause();
//demo scheduler.is_processing() === false;

//demo scheduler.schedule(function (done) {
//demo     console.log("A scheduled task 1");
//demo     done();
//demo });
//demo scheduler.schedule(function (done) {
//demo     console.log("A scheduled task 2");
//demo     done();
//demo });
//demo scheduler.schedule(function (done) {
//demo     console.log("A scheduled task 3");
//demo     done();
//demo });
//demo scheduler.schedule(function (done) {
//demo     console.log("A scheduled task 4");
//demo     done();
//demo });
//demo scheduler.schedule(function (done) {
//demo     console.log("A scheduled task 5");
//demo     done();
//demo });
//demo scheduler.schedule(function (done) {
//demo     console.log("A scheduled task 6");
//demo     done();
//demo });

//demo scheduler.is_processing() === true;

// scheduler size is 5 even though we have queued 6 tasks
//demo scheduler.size() === 5;

//demo scheduler.resume();
//demo scheduler.size() === 0;
//demo scheduler.is_processing() === false;



export default Object.freeze(make_scheduler);