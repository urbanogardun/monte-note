import { EnthusiasmAction, SetNotebooksLocation, GetNotebooks } from '../actions';
import { StoreState } from '../types/index';
import { INCREMENT_ENTHUSIASM, DECREMENT_ENTHUSIASM, SET_NOTEBOOKS_LOCATION, GET_NOTEBOOKS } from '../constants/index';
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

export function notebooks(state: StoreState, action: GetNotebooks): StoreState {
  console.log(action.type);
  switch (action.type) {
    case GET_NOTEBOOKS:
      return ['huh'] as StoreState;
    default:
      return state || ['lala'] as StoreState;
    }
}

const rootReducers: Reducer<StoreState> = combineReducers({ enthusiasmLevel, notebooksLocation, notebooks });

export default rootReducers;