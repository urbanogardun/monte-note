import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';

import { createStore } from 'redux';
import { enthusiasmLevel } from './reducers/index';
import { StoreState } from './types/index';

const store = createStore<StoreState>(enthusiasmLevel, {
  enthusiasmLevel: 1,
  notebooksLocation: '',
});

beforeAll(() => {
  const ls = require('./utils/localStorage');
  ls.setLocalStorage();
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  div);
});
