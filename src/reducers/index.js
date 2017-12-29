"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../constants/index");
const redux_1 = require("redux");
function enthusiasmLevel(state, action) {
    switch (action.type) {
        case index_1.INCREMENT_ENTHUSIASM:
            return (state.enthusiasmLevel + 1);
        case index_1.DECREMENT_ENTHUSIASM:
            return Math.max(1, state.enthusiasmLevel - 1);
        default:
            return state || 1;
    }
}
exports.enthusiasmLevel = enthusiasmLevel;
function notebooksLocation(state, action) {
    switch (action.type) {
        case index_1.SET_NOTEBOOKS_LOCATION:
            return action.notebooksLocation;
        default:
            return state || '';
    }
}
exports.notebooksLocation = notebooksLocation;
function notebooks(state, action) {
    switch (action.type) {
        case index_1.GET_NOTEBOOKS:
            return ['huh'];
        default:
            return state || ['lala'];
    }
}
exports.notebooks = notebooks;
const rootReducers = redux_1.combineReducers({ enthusiasmLevel, notebooksLocation, notebooks });
exports.default = rootReducers;
