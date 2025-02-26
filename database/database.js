// database.js
// Martin Pravda

/*jslint browser */
/*global indexedDB */

import make_indexed_db from "./indexed_db.js";
import config from "./config.js";

function open(callback, {
    db_name,
    version = 1
}) {

// open the connection
    const {stores} = config;
    const request = indexedDB.open(db_name, version);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

// initialize the object stores for the docs and indexes

        stores.forEach(function ({
            autoIncrement,
            keyPath,
            name
        }) {

// first, check if stores have been already initialized

            if (db.objectStoreNames.contains(name) === false) {
                db.createObjectStore(name, {
                    autoIncrement,
                    keyPath
                });
            }
        });
    };

    request.onsuccess = function (event) {
        const db_instance = event.target.result;
        const indexed_db = make_indexed_db({
            db: db_instance,
            db_name
        });

        callback(indexed_db);
    };

    request.onerror = function (event) {
        const error = event.target.error;
        callback(undefined, {
            error,
            message: `
                Connection to the database ${db_name}:v${version} has failed.
            `
        });
    };
}

function list(callback) {
    indexedDB.databases().then(function (info) {
        callback(info);
    }).catch(function (error) {
        callback(undefined, error);
    });
}

//demo import parseq from "../utils/parseq.js";

//demo function open_connection(config) {
//demo     return function (callback) {
//demo         open(function (db) {
//demo             callback(db);
//demo         }, config);
//demo     };
//demo }

//demo function add_data(document) {
//demo     return function (callback, db) {
//demo         db.create(function (result) {
//demo            callback({db, result});
//demo         }, document);
//demo     };
//demo }

//demo function read_data(callback, {db, result}) {
//demo     db.get(function (data) {
//demo         callback(data);
//demo     }, result);
//demo }

//demo function log(data, reason) {
//demo     if (reason) {
//demo         console.error(reason);
//demo         return;
//demo     }

//demo     console.log(data);
//demo }

//demo parseq.sequence([
//demo     open_connection({
//demo         db_name: "test",
//demo         version: 1
//demo     }),
//demo     add_data({
//demo         id: 2,
//demo         name: "foo"
//demo     }),
//demo     read_data
//demo ])(log);

export default Object.freeze({
    list,
    open
});