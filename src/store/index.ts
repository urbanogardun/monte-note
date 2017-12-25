import { createStore } from 'redux';
import reducer from '../reducers/index';
import { StoreState } from '../types/index';
import { NOTEBOOK_SAVE_DIRECTORY } from '../utils/constants';

// Hydrate the state
let notebooksLocation;
try {
  notebooksLocation = localStorage.getItem(NOTEBOOK_SAVE_DIRECTORY) || '';
} catch (error) {
  notebooksLocation = '';
}

const reduxStore = createStore<StoreState>(reducer, {
  enthusiasmLevel: 1,
  notebooksLocation: notebooksLocation,
});

export default reduxStore;