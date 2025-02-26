// processor.js
// Martin Pravda

/*jslint browser */

import requestors from "./requestors.js";
import config from "./config.js";

function make_processor(db) {
    const {
        docs_store_name,
        index_store_name
    } = config;

    return function processor(callback, message) {
        const transaction = db.transaction([
            docs_store_name,
            index_store_name
        ], "readwrite");

        const docs_store = transaction.objectStore(docs_store_name);
        const index_store = transaction.objectStore(index_store_name);
        const requestor = requestors[message.operation];

        requestor(callback, {
            docs_store,
            index_store,
            message
        });

        transaction.onerror = function (event) {
            return callback(undefined, {
                error: event.target.error,
                message: "A transaction error has occured."
            });
        };
    };
}

export default Object.freeze(make_processor);