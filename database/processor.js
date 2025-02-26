// processor.js
// Martin Pravda

/*jslint browser */

import requestors from "./requestors.js";

function make_processor({
    db,
    store_name
}) {
    return function processor(callback, message) {
        const transaction = db.transaction([store_name], "readwrite");
        const store = transaction.objectStore(store_name);
        const requestor = requestors[message.operation];

        requestor(callback, {
            message,
            store
        });

        transaction.onerror = function (event) {
            return callback(undefined, {
                error: event.error,
                message: "A transaction error has occured."
            });
        };
    };
}

export default Object.freeze(make_processor);