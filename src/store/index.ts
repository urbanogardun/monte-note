import { createStore } from 'redux';
import { enthusiasm } from '../reducers/index';
import { StoreState } from '../types/index';

const reduxStore = createStore<StoreState>(enthusiasm, {
  enthusiasmLevel: 1,
  languageName: 'TypeScript',
  notebooksLocation: '',
});

export default reduxStore;