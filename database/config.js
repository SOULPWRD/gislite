// config.js
// Martin Pravda

const docs_store_name = "docs";
const index_store_name = "indexes";
const indexes_meta_store_name = "indexes_meta";

const stores = [
    {
        autoIncrement: true,
        keyPath: "id",
        name: docs_store_name
        
    },
    {
        autoIncrement: false,
        keyPath: ["index_name", "key", "doc_id"],
        name: index_store_name
    },
    {
        autoIncrement: false,
        keyPath: "name",
        name: indexes_meta_store_name
    }
];

export default Object.freeze({
    stores,
    docs_store_name,
    index_store_name,
    indexes_meta_store_name
});