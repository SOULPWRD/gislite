// queue.js
// Martin Pravda

// This is a simple wrapper around the array primitive

/*jslint */

function make_queue() {
    let pool = [];

    function push(data) {
        pool.push(data);
    }

    function pop() {
        return pool.shift();
    }

    function clear() {
        pool = [];
    }

    function size() {
        return pool.length;
    }

    function peek() {
        const [first] = pool;
        return first;
    }

    return Object.freeze({
        clear,
        peek,
        pop,
        push,
        size
    });
}

export default Object.freeze(make_queue);