import { isNotebooksLocationSet } from './isNotebooksLocationSet';
const Store = require('electron-store');
const store = new Store();

test('returns false if location for notebooks is not set', () => {
  store.delete('notebooks-location');
  
  expect(isNotebooksLocationSet()).toEqual(false);
});

test('returns true if location for notebooks is set', () => {
  store.set('notebooks-location', process.cwd());
  
  expect(isNotebooksLocationSet()).toEqual(true);
});