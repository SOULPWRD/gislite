// async_queue.js
// Martin Pravda

/*jslint browser */

import make_pubsub from "./pubsub.js";
import make_scheduler from "./scheduler.js";
import make_queue from "./queue.js";

function make_async_queue(concurrency_limit = 1) {
    const pubsub = make_pubsub();
    const scheduler = make_scheduler(concurrency_limit);
    
// as long as the listener has not been attached
// we have to push to the task into the temporal queue
// of the make_async_queue instance
    
    const queue = make_queue();

// we need to keep track if the subscriber callback has been registered

    let is_subscribed = false;

    function push(callback, data) {

// processing automatically starts with the very first push

        queue.push({
            callback,
            data
        });

        if (is_subscribed) {
            pubsub.emit("process_task", queue.pop());
        }
    }

    function dispose() {
        scheduler.clear();
        pubsub.clear();
    }

    function subscribe(callback) {
        if (is_subscribed) {
            return;
        }

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

        const usubscribe = pubsub.subscribe(
            "process_task",
            process_task
        );

// empty the queue with the enqueued tasks

        Array.from(new Array(queue.size())).forEach(function () {
            process_task(queue.pop());
        });

        return Object.freeze(usubscribe);
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
        resume: scheduler.resume,
        subscribe
    });
}

//demo const async_queue = make_async_queue();

//demo function done() {
//demo     console.log("done");
//demo }

//demo async_queue.push(done, 0);
//demo async_queue.push(done, 1);
//demo async_queue.push(done, 2);
//demo async_queue.push(done, 3);
//demo async_queue.push(done, 4);

//demo async_queue.subscribe(function (next, num) {
//demo     setTimeout(function () {
//demo         console.log("Async iteration: ", num);
//demo         next();
//demo     }, 1000);
//demo });

//demo setTimeout(function () {
//demo     async_queue.pause();
//demo }, 1000);

//demo setTimeout(function () {
//demo     async_queue.resume();
//demo }, 2000);

export default Object.freeze(make_async_queue);