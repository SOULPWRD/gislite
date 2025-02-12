// async_queue.js
// Martin Pravda

/*jslint browser */

import make_pubsub from "./pubsub.js";
import make_scheduler from "./scheduler.js";

function make_async_queue(callback, concurrency_limit = 1) {
    const pubsub = make_pubsub();
    const scheduler = make_scheduler(concurrency_limit);

    function process_task(task) {
        scheduler.schedule(function (done) {
            callback(function (data, error) {
                if (error) {
                    pubsub.emit("error");
                }

                task.callback(data, error);

    // done callback is a callback from scheduler signaling to release the callback
    // from the scheduler's map

                done();
            }, task.data);
        });
    }

    function push(callback, data) {

// processing automatically starts with the very first push

        process_task({
            callback,
            data
        });
    }

    function dispose() {
        scheduler.clear();
        pubsub.clear();
    }

    function properties() {

// it's nice to have some additional information about the queue

        return Object.freeze({
            running_tasks_size: scheduler.size
        });
    }

    function register_listener(event) {
        return function (callback) {
            pubsub.subscribe(event, callback);
        };
    }

    return Object.freeze({
        dispose,
        on_drain: register_listener("drain"),
        on_error: register_listener("error"),
        pause: scheduler.pause,
        properties,
        push,
        resume: scheduler.resume
    });
}

//demo const async_queue = make_async_queue(function (next, num) {
//demo     setTimeout(function () {
//demo         console.log("Async iteration: ", num);
//demo         next();
//demo     }, 1000);
//demo });

//demo async_queue.pause();

//demo function done() {
//demo     console.log("done");
//demo }

//demo async_queue.push(done, 0);
//demo async_queue.push(done, 1);
//demo async_queue.push(done, 2);
//demo async_queue.push(done, 3);
//demo async_queue.push(done, 4);

//demo async_queue.resume();

//demo setTimeout(function () {
//demo     async_queue.pause();
//demo }, 1000);

//demo setTimeout(function () {
//demo     async_queue.resume();
//demo }, 2000);

export default Object.freeze(make_async_queue);