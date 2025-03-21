// indexed_db.js
// Martin Pravda

/*jslint browser */
/*global indexedDB */

import make_async_queue from "../utils/async_queue.js";
import make_processor from "./processor.js";

function make_index_db({
    concurrency_limit = 1,
    db,
    db_name
}) {

// create a queue processor

    const processor = make_processor(db);

    const queue = make_async_queue(processor, concurrency_limit);

// drop the database

    function drop(callback) {
        const request = indexedDB.deleteDatabase(db_name);

        request.onsuccess = function (event) {
            callback(event.target.result);
        };

        request.onerror = function (event) {
            callback(undefined, event.target.error);
        };
    }

// retrieve the document

    function get(callback, document) {
        queue.push(callback, {
            document,
            operation: "read"
        });
    }

// create a document

    function create(callback, document) {
        queue.push(callback, {
            document,
            operation: "create"
        });
    }

// update the document

    function update(callback, document) {
        queue.push(callback, {
            document,
            operation: "update"
        });
    }

// remove the document

    function remove(callback, document) {
        queue.push(callback, {
            document,
            operation: "delete"
        });
    }

    function create_index(callback, document) {
        queue.push(callback, {
            document,
            operation: "create_index"
        });
    }

    return Object.freeze({
        create,
        create_index,
        drop,
        get,
        remove,
        update
    });
}

//demo const name = "gislite";
//demo const db_request = indexedDB.open(name, 1);
//demo db_request.onsuccess = function (event) {
//demo     const db = event.target.result;
//demo     const index_db = make_index_db(db, name, );
//demo };

export default Object.freeze(make_index_db);
