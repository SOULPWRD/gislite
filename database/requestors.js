// requestors.js
// Martin Pravda

// Requestor is a function that takes the store and payload
// and create request for the given payload
// For instance the requestor can store or delete the payload

/*jslint browser */

function make_requestor(requestor) {
    return function (callback, {
        docs_store,
        index_store,
        message
    }) {
        const request = requestor(message.document, {
            docs_store,
            index_store
        });

        request.onsuccess = function (event) {
            callback(event.target.result);
        };

        request.onerror = function (event) {
            callback(undefined, {
                error: event.target.error,
                message: `
                    An error occurred during the request
                    on the operation ${message.operation}`
            });
        };
    };
}

const requestors = {
    create: make_requestor(function (document, {docs_store}) {
        return docs_store.add(document);
    }),
    delete: make_requestor(function (document, {docs_store}) {
        return docs_store.delete(document);
    }),
    read: make_requestor(function (document, {docs_store}) {
        return docs_store.get(document);
    }),
    update: make_requestor(function (document, {docs_store}) {
        return docs_store.put(document);
    })
};

export default Object.freeze(requestors);