// index_db.js
// Martin Pravda

/*jslint browser */
/*global indexedDB */

import make_async_queue from "../utils/async_queue.js";

function make_index_db(name, version) {
    const queue = make_async_queue();
    const db_request = indexedDB.open(name, version);

    db_request.onerror = function on_error(event) {

// keep this empty for now
// we have to handle errors somehow

    };

    db_request.onsuccess = function on_success(event) {
        const db_instance = event.target.result;

        queue.subscribe(function worker(callback, message) {

// process the message here and do the magic
// retrieve and store data to indexdb

            const {
                document,
                operation
            } = message;

        });
    };

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

//demo const db = make_index_db({
//demo     name: "name", version: 1
//demo });
//demo db.list(function (databases, err) {
//demo     if (err) {
//demo         console.log(err);
//demo         return;
//demo     }
//demo
//demo     console.log(databases);
//demo });

export default Object.freeze(make_index_db);