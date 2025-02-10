// async_queue.js
// Martin Pravda

/*jslint browser */

import make_queue from "./queue.js";
import make_pubsub from "./pubsub.js";
import make_scheduler from "./scheduler.js";

function make_async_queue(callback, concurrency_limit = 1) {
    const pubsub = make_pubsub();
    const queue = make_queue();
    const scheduler = make_scheduler(concurrency_limit);

    function process_task() {
        const task = queue.pop();

        if (task === undefined) {
            return pubsub.emit("drain");
        }

        scheduler.schedule(function (release) {
            callback(function (data, error) {
                if (error) {
                    pubsub.emit("error");
                }

                task.callback(data, error);

// done callback is a callback from scheduler signaling to release the callback
// from the scheduler's map

                release();

// once it's released, process next task

                process_task();
            });
        });
    }

    function push(callback, data) {

// processing automatically starts with the very first push

        queue.push({
            callback,
            data
        });

        if (scheduler.is_full() === false) {
            return process_task();
        }
    }

    function pause() {
        scheduler.pause();
    }

    function resume() {
        scheduler.resume();
    }

    function stop() {
        queue.clear();
        scheduler.clear();
    }

    function dispose() {
        stop();
        pubsub.clear();
    }

    function properties() {

// it's nice to have some additional information about the queue

        const queue_size = queue.size();
        const running_tasks_size = scheduler.size;

        return Object.freeze({
            queue_size,
            running_tasks_size
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
        pause,
        properties,
        push,
        resume,
        stop
    });
}

export default Object.freeze(make_async_queue);