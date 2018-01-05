import { EnthusiasmAction, SetNotebooksLocation, NotebooksAction, NoteAction, LastOpenedNoteAction } from '../actions';
import { StoreState } from '../types/index';
import { 
  INCREMENT_ENTHUSIASM, 
  DECREMENT_ENTHUSIASM, 
  SET_NOTEBOOKS_LOCATION, 
  GET_NOTEBOOKS, 
  ADD_NOTEBOOK,
  ADD_NOTE,
  LOAD_NOTES,
  LAST_OPENED_NOTE } from '../constants/index';
import { combineReducers, Reducer  } from 'redux';

export function enthusiasmLevel(state: StoreState, action: EnthusiasmAction): StoreState {
  switch (action.type) {
    case INCREMENT_ENTHUSIASM:
      return (state.enthusiasmLevel as number + 1) as StoreState;
    case DECREMENT_ENTHUSIASM:
      return Math.max(1, state.enthusiasmLevel as number - 1) as StoreState;
    default:
        return state || 1 as StoreState;
    }
}

export function notebooksLocation(state: StoreState, action: SetNotebooksLocation): StoreState {
  switch (action.type) {
    case SET_NOTEBOOKS_LOCATION:
      return action.notebooksLocation as StoreState;
    default:
      return state || '' as StoreState;
    }
}

export function notebooks(state: StoreState, action: NotebooksAction): StoreState {
  switch (action.type) {
    case GET_NOTEBOOKS:
      return action.notebooks as StoreState;
    case ADD_NOTEBOOK:
      return [...state as StoreState[], action.notebook] as StoreState;
    default:
      return state || ['lala'] as StoreState;
    }
}

export function notes(state: StoreState, action: NoteAction): StoreState {
  switch (action.type) {
    case ADD_NOTE:
      return [...state as StoreState[], action.note] as StoreState;
    case LOAD_NOTES:
      if (action.notes.length) {
        return [...action.notes] as StoreState;
      } else {
        return [] as StoreState;
      }
    default:
      return state || [] as StoreState;
  }
}

export function lastOpenedNote(state: StoreState, action: LastOpenedNoteAction): StoreState {
  switch (action.type) {
    case LAST_OPENED_NOTE:
      return action.note as StoreState;
    default:
      return state || '' as StoreState;
  }
}

const rootReducers: Reducer<StoreState> = combineReducers(
  { enthusiasmLevel, notebooksLocation, notebooks, notes, lastOpenedNote }
);

export default rootReducers;