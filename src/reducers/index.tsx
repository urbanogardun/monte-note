import { EnthusiasmAction, 
  SetNotebooksLocation, 
  NotebooksAction, 
  NoteAction, 
  LastOpenedNoteAction, 
  LoadContentIntoNote, 
  TrashAction, 
  LoadTagsForNote,
  SearchResultsAction,
  PreviewAction, 
  TagsAction,
  UpdateSelectedTags,
  UpdateSearchQuery,
  UpdateSelectedNotebook} from '../actions';
import { StoreState, SearchData } from '../types/index';
import { 
  INCREMENT_ENTHUSIASM, 
  DECREMENT_ENTHUSIASM, 
  SET_NOTEBOOKS_LOCATION, 
  GET_NOTEBOOKS, 
  ADD_NOTEBOOK,
  ADD_NOTE,
  LOAD_NOTES,
  LAST_OPENED_NOTE,
  LOAD_CONTENT_INTO_NOTE,
  LOAD_TRASH,
  LOAD_LAST_OPENED_TRASH_NOTE,
  LOAD_LAST_OPENED_TRASH_NOTEBOOK,
  LOAD_TAGS_FOR_NOTE,
  LOAD_SEARCH_RESULTS,
  LOAD_PREVIEW_CONTENT,
  UPDATE_PREVIEW_CONTENT_TAGS,
  RELOAD_SEARCH_RESULTS,
  LOAD_ALL_TAGS,
  UPDATE_SELECTED_TAGS,
  APPEND_SEARCH_RESULTS,
  UPDATE_SEARCH_QUERY,
  UPDATE_SELECTED_NOTEBOOK } from '../constants/index';
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
      if (action.note) {
        return action.note as StoreState;
      } else {
        return state as StoreState;
      }
    default:
      return state || '' as StoreState;
  }
}

export function noteContent(state: StoreState, action: LoadContentIntoNote): StoreState {
  switch (action.type) {
    case LOAD_CONTENT_INTO_NOTE:
      return action.content as StoreState;
    default:
      return state || '' as StoreState;
  }
}

export function trash(state: StoreState, action: TrashAction): StoreState {
  switch (action.type) {
    case LOAD_TRASH:
      return action.content as StoreState;
    default:
      return state || {} as StoreState;
  }
}

export function lastOpenedTrashNote(state: StoreState, action: TrashAction): StoreState {
  switch (action.type) {
    case LOAD_LAST_OPENED_TRASH_NOTE:
      return action.note as StoreState;
    default:
      return state || '' as StoreState;
  }
}

export function lastOpenedTrashNotebook(state: StoreState, action: TrashAction): StoreState {
  switch (action.type) {
    case LOAD_LAST_OPENED_TRASH_NOTEBOOK:
      return action.notebook as StoreState;
    default:
      return state || '' as StoreState;
  }
}

export function currentNoteTags(state: StoreState, action: LoadTagsForNote): StoreState {
  switch (action.type) {
    case LOAD_TAGS_FOR_NOTE:
      return [...action.tags] as StoreState;
    default:
      return state || [] as StoreState;
  }
}

export function searchResults(state: StoreState, action: SearchResultsAction): StoreState {
  switch (action.type) {
    case LOAD_SEARCH_RESULTS:
      return action as StoreState;
    case APPEND_SEARCH_RESULTS:
      let oldState = state as SearchData;
      let allResults = [...oldState.results, ...action.results];
      action.results = allResults;
      return action as StoreState;
    case RELOAD_SEARCH_RESULTS:
      return {results: action.results, query: ''} as StoreState;
    default:
      return state || {results: [], query: ''} as StoreState;
  }
}

export function previewContent(state: StoreState, action: PreviewAction): StoreState {
  switch (action.type) {
    case LOAD_PREVIEW_CONTENT:
      return {
        notebook: action.notebook,
        note: action.note,
        noteContent: action.noteContent,
        tags: action.tags
      } as StoreState;
    case UPDATE_PREVIEW_CONTENT_TAGS:
      return {...state, tags: action.tags} as StoreState;
    default:
      return state || {
        notebook: '',
        note: '',
        noteContent: '',
        tags: []
      } as StoreState;
  }
}

export function allTags(state: StoreState, action: TagsAction): StoreState {
  switch (action.type) {
    case LOAD_ALL_TAGS:
      return action.tags as StoreState;
    default:
      return state || [];
  }
}

export function selectedTags(state: StoreState, action: UpdateSelectedTags): StoreState {
  switch (action.type) {
    case UPDATE_SELECTED_TAGS:
      return action.tags as StoreState;
    default:
      return state || [];
  }
}

export function searchQuery(state: StoreState, action: UpdateSearchQuery): StoreState {
  switch (action.type) {
    case UPDATE_SEARCH_QUERY:
      return action.query as StoreState;
    default:
      return state || '' as StoreState;
  }
}

export function selectedNotebook(state: StoreState, action: UpdateSelectedNotebook): StoreState {
  switch (action.type) {
    case UPDATE_SELECTED_NOTEBOOK:
      return action.notebook as StoreState;
    default:
      return state || '' as StoreState;
  }
}

const rootReducers: Reducer<StoreState> = combineReducers(
  { 
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
    selectedNotebook
  }
);

export default rootReducers;