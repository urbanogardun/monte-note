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

export type EnthusiasmAction = IncrementEnthusiasm | DecrementEnthusiasm;

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