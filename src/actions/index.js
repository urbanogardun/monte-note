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
function addNotebook(notebook) {
    return {
        type: constants.ADD_NOTEBOOK,
        notebook
    };
}
exports.addNotebook = addNotebook;
function addNote(note) {
    return {
        type: constants.ADD_NOTE,
        note
    };
}
exports.addNote = addNote;
function loadNotes(notes) {
    return {
        type: constants.LOAD_NOTES,
        notes
    };
}
exports.loadNotes = loadNotes;
function loadLastOpenedNote(note) {
    return {
        type: constants.LAST_OPENED_NOTE,
        note
    };
}
exports.loadLastOpenedNote = loadLastOpenedNote;
function loadContentIntoNote(content) {
    return {
        type: constants.LOAD_CONTENT_INTO_NOTE,
        content
    };
}
exports.loadContentIntoNote = loadContentIntoNote;
function loadTrash(content) {
    return {
        type: constants.LOAD_TRASH,
        content
    };
}
exports.loadTrash = loadTrash;
function loadLastOpenedTrashNote(note) {
    return {
        type: constants.LOAD_LAST_OPENED_TRASH_NOTE,
        note
    };
}
exports.loadLastOpenedTrashNote = loadLastOpenedTrashNote;
function loadLastOpenedTrashNotebook(notebook) {
    return {
        type: constants.LOAD_LAST_OPENED_TRASH_NOTEBOOK,
        notebook
    };
}
exports.loadLastOpenedTrashNotebook = loadLastOpenedTrashNotebook;
function loadTagsForNote(tags) {
    return {
        type: constants.LOAD_TAGS_FOR_NOTE,
        tags
    };
}
exports.loadTagsForNote = loadTagsForNote;
function loadSearchResults(data) {
    return {
        type: constants.LOAD_SEARCH_RESULTS,
        results: data.results,
        query: data.query,
        notebook: data.notebook
    };
}
exports.loadSearchResults = loadSearchResults;
function appendSearchResults(data) {
    return {
        type: constants.APPEND_SEARCH_RESULTS,
        results: data.results,
        query: data.query,
        notebook: data.notebook
    };
}
exports.appendSearchResults = appendSearchResults;
function reloadSearchResults(results) {
    return {
        type: constants.RELOAD_SEARCH_RESULTS,
        results
    };
}
exports.reloadSearchResults = reloadSearchResults;
function loadPreviewContent(data) {
    return {
        type: constants.LOAD_PREVIEW_CONTENT,
        notebook: data.notebook,
        note: data.note,
        noteContent: data.noteContent,
        tags: data.tags
    };
}
exports.loadPreviewContent = loadPreviewContent;
function updatePreviewContentTags(tags) {
    return {
        type: constants.UPDATE_PREVIEW_CONTENT_TAGS,
        tags
    };
}
exports.updatePreviewContentTags = updatePreviewContentTags;
function loadAllTags(tags) {
    return {
        type: constants.LOAD_ALL_TAGS,
        tags
    };
}
exports.loadAllTags = loadAllTags;
function updateAllTags(tag) {
    return {
        type: constants.UPDATE_ALL_TAGS,
        tag
    };
}
exports.updateAllTags = updateAllTags;
function updateSelectedTags(tags) {
    return {
        type: constants.UPDATE_SELECTED_TAGS,
        tags
    };
}
exports.updateSelectedTags = updateSelectedTags;
function updateSearchQuery(query) {
    return {
        type: constants.UPDATE_SEARCH_QUERY,
        query
    };
}
exports.updateSearchQuery = updateSearchQuery;
function updateSelectedNotebook(notebook) {
    return {
        type: constants.UPDATE_SELECTED_NOTEBOOK,
        notebook
    };
}
exports.updateSelectedNotebook = updateSelectedNotebook;
function updatePreview(notebook, note) {
    return {
        type: constants.UPDATE_PREVIEW,
        notebook: notebook,
        note: note
    };
}
exports.updatePreview = updatePreview;
function pathToNewUploadedImage(path) {
    return {
        type: constants.PATH_TO_NEW_IMAGE,
        path
    };
}
exports.pathToNewUploadedImage = pathToNewUploadedImage;
function pathToNewUploadedAttachment(path, filename) {
    return {
        type: constants.PATH_TO_NEW_ATTACHMENT,
        path,
        filename
    };
}
exports.pathToNewUploadedAttachment = pathToNewUploadedAttachment;
