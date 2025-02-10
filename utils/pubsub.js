// pubsub.js
// Martin Pravda

// A simple pubsub module

/*jslint browser, node */

function make_pubsub() {
    let pool = new Map();
    let pool_ids = new Set();

    function emit(event, data) {
        const callbacks = pool.get(event);
        callbacks.forEach(function (callback) {
            let timer_id = setTimeout(function () {
                callback(data);
            });
            pool_ids.add(timer_id);
        });
    }

    function subscribe(callback, event) {
        if (pool.has(event) === false) {
            pool.set(event, new Set());
        }

        pool.get(event).add(callback);

        return function unsubscribe() {
            pool.get(event).delete(callback);
        };
    }

    function stop() {
        if (pool_ids.size) {
            pool_ids.forEach(function (id) {
                clearTimeout(id);
            });
        }
    }

    function clear() {
        stop();
        pool = new Map();
        pool_ids = new Set();
    }

    return Object.freeze({
        clear,
        emit,
        stop,
        subscribe
    });
}

export default Object.freeze(make_pubsub);