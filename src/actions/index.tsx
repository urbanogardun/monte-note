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

export type EnthusiasmAction = IncrementEnthusiasm | DecrementEnthusiasm;

export type NotebooksAction = GetNotebooks | AddNotebook;

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