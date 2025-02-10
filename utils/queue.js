// queue.js
// Martin Pravda

// This is a simple wrapper around the array primitive

/*jslint browser, node*/

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

//demo const queue = make_queue();
//demo queue.push(1);
//demo queue.push(2);
//demo queue.push(3);
//demo queue.size() === 3;

//demo const one = queue.pop();
//demo queue.size() === 2;

//demo queue.peek() === 2;

//demo queue.clear();
//demo queue.size() === 0;

export default Object.freeze(make_queue);