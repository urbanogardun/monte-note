"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants = require("../constants");
function incrementEnthusiasm() {
    return {
        type: constants.INCREMENT_ENTHUSIASM
    };
}
exports.incrementEnthusiasm = incrementEnthusiasm;
function decrementEnthusiasm() {
    return {
        type: constants.DECREMENT_ENTHUSIASM
    };
}
exports.decrementEnthusiasm = decrementEnthusiasm;
function setNotebooksLocation(notebooksLocation) {
    return {
        type: constants.SET_NOTEBOOKS_LOCATION,
        notebooksLocation
    };
}
exports.setNotebooksLocation = setNotebooksLocation;
function getNotebooks(notebooks) {
    return {
        type: constants.GET_NOTEBOOKS,
        notebooks
    };
}
exports.getNotebooks = getNotebooks;
