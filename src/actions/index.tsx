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

export type EnthusiasmAction = IncrementEnthusiasm | DecrementEnthusiasm;

export type NotebooksAction = GetNotebooks | AddNotebook;

export type NoteAction = AddNote | LoadNotes;

export type LastOpenedNoteAction = LastOpenedNote;

export type TrashAction = LoadTrash | LoadLastOpenedTrashNote;

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