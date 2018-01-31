import * as constants from '../constants';

export interface IncrementEnthusiasm {
    type: constants.INCREMENT_ENTHUSIASM;
}

export interface DecrementEnthusiasm {
    type: constants.DECREMENT_ENTHUSIASM;
}

export interface SetNotebooksLocation {
    type: constants.SET_NOTEBOOKS_LOCATION;
    notebooksLocation: string;
}

export interface GetNotebooks {
    type: constants.GET_NOTEBOOKS;
    notebooks: string[];
}

export interface AddNotebook {
    type: constants.ADD_NOTEBOOK;
    notebook: string;
}

export interface AddNote {
    type: constants.ADD_NOTE;
    note: string;
}

export interface LoadNotes {
    type: constants.LOAD_NOTES;
    notes: string[];
}

export interface LastOpenedNote {
    type: constants.LAST_OPENED_NOTE;
    note: string;
}

export interface LoadContentIntoNote {
    type: constants.LOAD_CONTENT_INTO_NOTE;
    content: string;
}

export interface LoadTrash {
    type: constants.LOAD_TRASH;
    content: any;
}

export interface LoadLastOpenedTrashNote {
    type: constants.LOAD_LAST_OPENED_TRASH_NOTE;
    note: string;
}

export interface LoadLastOpenedTrashNotebook {
    type: constants.LOAD_LAST_OPENED_TRASH_NOTEBOOK;
    notebook: string;
}

export interface LoadTagsForNote {
    type: constants.LOAD_TAGS_FOR_NOTE;
    tags: string[];
}

export interface LoadSearchResults {
    type: constants.LOAD_SEARCH_RESULTS;
    results: object[];
    query: string;
    notebook: string;
}

export interface AppendSearchResults {
    type: constants.APPEND_SEARCH_RESULTS;
    results: object[];
    query: string;
    notebook: string;
}

export interface ReloadSearchResults {
    type: constants.RELOAD_SEARCH_RESULTS;
    results: object[];
}

export interface LoadPreviewContent {
    type: constants.LOAD_PREVIEW_CONTENT;
    notebook: string;
    note: string;
    noteContent: string;
    tags: string[];
}

export interface UpdatePreviewContentTags {
    type: constants.UPDATE_PREVIEW_CONTENT_TAGS;
    tags: string[];
}

export interface LoadAllTags {
    type: constants.LOAD_ALL_TAGS;
    tags: string[];
}

export interface UpdateAllTags {
    type: constants.UPDATE_ALL_TAGS;
    tag: string;
}

export interface UpdateSelectedTags {
    type: constants.UPDATE_SELECTED_TAGS;
    tags: string[];
}

export interface UpdateSearchQuery {
    type: constants.UPDATE_SEARCH_QUERY;
    query: string;
}

export interface UpdateSelectedNotebook {
    type: constants.UPDATE_SELECTED_NOTEBOOK;
    notebook: string;
}

export interface UpdatePreview {
    type: constants.UPDATE_PREVIEW;
    notebook: string;
    note: string;
}

export interface UploadedMediaImage {
    type: constants.PATH_TO_NEW_IMAGE;
    path: string;
}

export interface UploadedMediaAttachment {
    type: constants.PATH_TO_NEW_ATTACHMENT;
    path: string;
    filename: string;
}

export type TagsAction = LoadAllTags | UpdateAllTags;

export type EnthusiasmAction = IncrementEnthusiasm | DecrementEnthusiasm;

export type NotebooksAction = GetNotebooks | AddNotebook;

export type NoteAction = AddNote | LoadNotes;

export type LastOpenedNoteAction = LastOpenedNote;

export type TrashAction = LoadTrash | LoadLastOpenedTrashNote | LoadLastOpenedTrashNotebook;

export type PreviewAction = LoadPreviewContent | UpdatePreviewContentTags;

export type SearchResultsAction = LoadSearchResults | ReloadSearchResults | AppendSearchResults;

export type UploadedAction = UploadedMediaImage | UploadedMediaAttachment;

export function incrementEnthusiasm(): IncrementEnthusiasm {
    return {
        type: constants.INCREMENT_ENTHUSIASM
    };
}

export function decrementEnthusiasm(): DecrementEnthusiasm {
    return {
        type: constants.DECREMENT_ENTHUSIASM
    };
}

export function setNotebooksLocation(notebooksLocation: string): SetNotebooksLocation {
    return {
        type: constants.SET_NOTEBOOKS_LOCATION,
        notebooksLocation
    };
}

export function getNotebooks(notebooks: string[]): GetNotebooks {
    return {
        type: constants.GET_NOTEBOOKS,
        notebooks
    };
}

export function addNotebook(notebook: string): AddNotebook {
    return {
        type: constants.ADD_NOTEBOOK,
        notebook
    };
}

export function addNote(note: string): AddNote {
    return {
        type: constants.ADD_NOTE,
        note
    };
}

export function loadNotes(notes: string[]): LoadNotes {
    return {
        type: constants.LOAD_NOTES,
        notes
    };
}

export function loadLastOpenedNote(note: string): LastOpenedNote {
    return {
        type: constants.LAST_OPENED_NOTE,
        note
    };
}

export function loadContentIntoNote(content: string): LoadContentIntoNote {
    return {
        type: constants.LOAD_CONTENT_INTO_NOTE,
        content
    };
}

export function loadTrash(content: any): LoadTrash {
    return {
        type: constants.LOAD_TRASH,
        content
    };
}

export function loadLastOpenedTrashNote(note: string): LoadLastOpenedTrashNote {
    return {
        type: constants.LOAD_LAST_OPENED_TRASH_NOTE,
        note
    };
}

export function loadLastOpenedTrashNotebook(notebook: string): LoadLastOpenedTrashNotebook {
    return {
        type: constants.LOAD_LAST_OPENED_TRASH_NOTEBOOK,
        notebook
    };
}

export function loadTagsForNote(tags: string[]): LoadTagsForNote {
    return {
        type: constants.LOAD_TAGS_FOR_NOTE,
        tags
    };
}

export function loadSearchResults(data: any): SearchResultsAction {
    return {
        type: constants.LOAD_SEARCH_RESULTS,
        results: data.results,
        query: data.query,
        notebook: data.notebook
    };
}

export function appendSearchResults(data: any): SearchResultsAction {
    return {
        type: constants.APPEND_SEARCH_RESULTS,
        results: data.results,
        query: data.query,
        notebook: data.notebook
    };
}

export function reloadSearchResults(results: object[]): SearchResultsAction {
    return {
        type: constants.RELOAD_SEARCH_RESULTS,
        results
    };
}

export function loadPreviewContent(data: any): PreviewAction {
    return {
        type: constants.LOAD_PREVIEW_CONTENT,
        notebook: data.notebook,
        note: data.note,
        noteContent: data.noteContent,
        tags: data.tags
    };
}

export function updatePreviewContentTags(tags: string[]): PreviewAction {
    return {
        type: constants.UPDATE_PREVIEW_CONTENT_TAGS,
        tags
    };
}

export function loadAllTags(tags: string[]): LoadAllTags {
    return {
        type: constants.LOAD_ALL_TAGS,
        tags
    };
}

export function updateAllTags(tag: string): UpdateAllTags {
    return {
        type: constants.UPDATE_ALL_TAGS,
        tag
    };
}

export function updateSelectedTags(tags: string[]): UpdateSelectedTags {
    return {
        type: constants.UPDATE_SELECTED_TAGS,
        tags
    };
}

export function updateSearchQuery(query: string): UpdateSearchQuery {
    return {
        type: constants.UPDATE_SEARCH_QUERY,
        query
    };
}

export function updateSelectedNotebook(notebook: string): UpdateSelectedNotebook {
    return {
        type: constants.UPDATE_SELECTED_NOTEBOOK,
        notebook
    };
}

export function updatePreview(notebook: string, note: string): UpdatePreview {
    return {
        type: constants.UPDATE_PREVIEW,
        notebook: notebook,
        note: note
    };
}

export function pathToNewUploadedImage(path: string): UploadedMediaImage {
    return {
        type: constants.PATH_TO_NEW_IMAGE,
        path
    };
}

export function pathToNewUploadedAttachment(path: string, filename: string): UploadedMediaAttachment {
    return {
        type: constants.PATH_TO_NEW_ATTACHMENT,
        path,
        filename
    };
}