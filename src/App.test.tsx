import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

// Jest uses jsdom for testing. Since jsdom doesn't have localStorage we import
// a mock of it.
beforeAll(() => {
  const ls = require('./utils/localStorage');
  ls.setLocalStorage();
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
