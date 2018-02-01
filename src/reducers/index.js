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
            return action.notebooks;
        case index_1.ADD_NOTEBOOK:
            return [...state, action.notebook];
        default:
            return state || ['lala'];
    }
}
exports.notebooks = notebooks;
function notes(state, action) {
    switch (action.type) {
        case index_1.ADD_NOTE:
            return [...state, action.note];
        case index_1.LOAD_NOTES:
            if (action.notes.length) {
                return [...action.notes];
            }
            else {
                return [];
            }
        default:
            return state || [];
    }
}
exports.notes = notes;
function lastOpenedNote(state, action) {
    switch (action.type) {
        case index_1.LAST_OPENED_NOTE:
            if (action.note) {
                return action.note;
            }
            else {
                return state;
            }
        default:
            return state || '';
    }
}
exports.lastOpenedNote = lastOpenedNote;
function noteContent(state, action) {
    switch (action.type) {
        case index_1.LOAD_CONTENT_INTO_NOTE:
            return action.content;
        default:
            return state || '';
    }
}
exports.noteContent = noteContent;
function trash(state, action) {
    switch (action.type) {
        case index_1.LOAD_TRASH:
            return action.content || {};
        default:
            return state || {};
    }
}
exports.trash = trash;
function lastOpenedTrashNote(state, action) {
    switch (action.type) {
        case index_1.LOAD_LAST_OPENED_TRASH_NOTE:
            return action.note;
        default:
            return state || '';
    }
}
exports.lastOpenedTrashNote = lastOpenedTrashNote;
function lastOpenedTrashNotebook(state, action) {
    switch (action.type) {
        case index_1.LOAD_LAST_OPENED_TRASH_NOTEBOOK:
            return action.notebook;
        default:
            return state || '';
    }
}
exports.lastOpenedTrashNotebook = lastOpenedTrashNotebook;
function currentNoteTags(state, action) {
    switch (action.type) {
        case index_1.LOAD_TAGS_FOR_NOTE:
            return [...action.tags];
        default:
            return state || [];
    }
}
exports.currentNoteTags = currentNoteTags;
function searchResults(state, action) {
    switch (action.type) {
        case index_1.LOAD_SEARCH_RESULTS:
            return action;
        case index_1.APPEND_SEARCH_RESULTS:
            let oldState = state;
            let allResults = [...oldState.results, ...action.results];
            action.results = allResults;
            return action;
        case index_1.RELOAD_SEARCH_RESULTS:
            return { results: action.results, query: '' };
        default:
            return state || { results: [], query: '' };
    }
}
exports.searchResults = searchResults;
function previewContent(state, action) {
    switch (action.type) {
        case index_1.LOAD_PREVIEW_CONTENT:
            return {
                notebook: action.notebook,
                note: action.note,
                noteContent: action.noteContent,
                tags: action.tags
            };
        case index_1.UPDATE_PREVIEW_CONTENT_TAGS:
            return Object.assign({}, state, { tags: action.tags });
        default:
            return state || {
                notebook: '',
                note: '',
                noteContent: '',
                tags: []
            };
    }
}
exports.previewContent = previewContent;
function allTags(state, action) {
    switch (action.type) {
        case index_1.LOAD_ALL_TAGS:
            return action.tags;
        case index_1.UPDATE_ALL_TAGS:
            let tags = state;
            if (tags.indexOf(action.tag) === -1) {
                return [...state, action.tag];
            }
            else {
                return state;
            }
        default:
            return state || [];
    }
}
exports.allTags = allTags;
function selectedTags(state, action) {
    switch (action.type) {
        case index_1.UPDATE_SELECTED_TAGS:
            return action.tags;
        default:
            return state || [];
    }
}
exports.selectedTags = selectedTags;
function searchQuery(state, action) {
    switch (action.type) {
        case index_1.UPDATE_SEARCH_QUERY:
            return action.query;
        default:
            return state || '';
    }
}
exports.searchQuery = searchQuery;
function selectedNotebook(state, action) {
    switch (action.type) {
        case index_1.UPDATE_SELECTED_NOTEBOOK:
            return action.notebook;
        default:
            return state || '';
    }
}
exports.selectedNotebook = selectedNotebook;
function previewData(state, action) {
    switch (action.type) {
        case index_1.UPDATE_PREVIEW:
            return { notebook: action.notebook, note: action.note };
        default:
            return state || { notebook: '', note: '' };
    }
}
exports.previewData = previewData;
function pathToNewestUploadedImage(state, action) {
    switch (action.type) {
        case index_1.PATH_TO_NEW_IMAGE:
            return action.path;
        default:
            return state || '';
    }
}
exports.pathToNewestUploadedImage = pathToNewestUploadedImage;
function pathToNewestUploadedAsset(state, action) {
    switch (action.type) {
        case index_1.PATH_TO_NEW_ATTACHMENT:
            return { path: action.path, filename: action.filename };
        default:
            return state || { path: '', filename: '' };
    }
}
exports.pathToNewestUploadedAsset = pathToNewestUploadedAsset;
const rootReducers = redux_1.combineReducers({
    enthusiasmLevel,
    notebooksLocation,
    notebooks,
    notes,
    lastOpenedNote,
    noteContent,
    trash,
    lastOpenedTrashNote,
    lastOpenedTrashNotebook,
    currentNoteTags,
    searchResults,
    previewContent,
    allTags,
    selectedTags,
    searchQuery,
    selectedNotebook,
    previewData,
    pathToNewestUploadedImage,
    pathToNewestUploadedAsset
});
exports.default = rootReducers;
