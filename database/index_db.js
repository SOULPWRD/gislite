// index_db.js
// Martin Pravda

/*jslint browser */
/*global indexedDB */

import make_async_queue from "../utils/async_queue.js";

function make_index_db(db, name) {
    const queue = make_async_queue(function worker(callback, message) {

// process the message here and do the magic
// retrieve and store data to indexdb

        callback(message);
    });

// list all databases

    function list(callback) {
        indexedDB.databases().then(function (info) {
            callback(info);
        }).catch(function (error) {
            callback(undefined, error);
        });
    }

// drop the database

    function drop(callback) {
        const request = indexedDB.deleteDatabase(name);

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
            operation: "READ"
        });
    }

// create a document

    function create(callback, document) {
        queue.push(callback, {
            document,
            operation: "CREATE"
        });
    }

// update the document

    function update(callback, document) {
        queue.push(callback, {
            document,
            operation: "UPDATE"
        });
    }

// remove the record

    function remove(callback, document) {
        queue.push(callback, {
            document,
            operation: "DELETE"
        });
    }

    return Object.freeze({
        create,
        drop,
        get,
        list,
        remove,
        update
    });
}

//demo const name = "gislite";
//demo const db_request = indexedDB.open(name, 1);
//demo db_request.onsuccess = function (event) {
//demo     const db = event.target.result;
//demo     const index_db = make_index_db(db, name);
//demo };

export default Object.freeze(make_index_db);