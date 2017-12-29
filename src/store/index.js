"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const index_1 = require("../reducers/index");
const constants_1 = require("../utils/constants");
// Hydrate the state
let notebooksLocation;
try {
    notebooksLocation = localStorage.getItem(constants_1.NOTEBOOK_SAVE_DIRECTORY) || '';
}
catch (error) {
    notebooksLocation = '';
}
let notebooks;
notebooks = ['la', 'bla1'];
const reduxStore = redux_1.createStore(index_1.default, {
    enthusiasmLevel: 1,
    notebooksLocation: notebooksLocation,
    notebooks: notebooks,
});
exports.default = reduxStore;
