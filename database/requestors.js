// requestors.js
// Martin Pravda

// Requestor is a function that takes the store and payload
// and create request for the given payload
// For instance the requestor can store or delete the payload

/*jslint browser */

function make_requestor(requestor) {
    return function (callback, {message, store}) {
        const request = requestor(store, message.document);
        request.onsuccess = function () {
            callback(message.document);
        };

        request.onerror = function (event) {
            callback(undefined, {
                error: event,
                message: `
                    An error occurred during the request
                    on the operation ${message.operation}`
            });
        };
    };
}

const requestors = {
    create: make_requestor(function (store, document) {
        return store.add(document);
    }),
    delete: make_requestor(function (store, document) {
        return store.delete(document);
    }),
    read: make_requestor(function (store, document) {
        return store.get(document);
    }),
    update: make_requestor(function (store, document) {
        return store.put(document);
    })
};

export default Object.freeze(requestors);