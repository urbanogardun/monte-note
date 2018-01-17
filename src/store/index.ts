import { createStore } from 'redux';
import reducer from '../reducers/index';
import { StoreState } from '../types/index';
// import { NOTEBOOK_SAVE_DIRECTORY } from '../utils/constants';

// Hydrate the state
let notebooksLocation;
notebooksLocation = '';

let notebooks: string[];
notebooks = [];

const reduxStore = createStore<StoreState>(reducer, {
  enthusiasmLevel: 1,
  notebooksLocation: notebooksLocation,
  notebooks: notebooks,
});

export default reduxStore;