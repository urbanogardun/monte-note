import ElectronMessager from './electronMessager';
import { NOTEBOOK_SAVE_DIRECTORY } from '../constants';

let testDir = 'C:\\test-dir';
// Jest uses jsdom for testing. Since jsdom doesn't have localStorage we import
// a mock of it.
beforeAll(() => {
  const ls = require('../localStorage');
  ls.setLocalStorage();
});

test('checks if location for notebooks has been set', () => {
  localStorage.setItem(NOTEBOOK_SAVE_DIRECTORY, testDir);

  let isLocationForNotebooksSet = ElectronMessager.isLocationForNotebooksSet();

  expect(isLocationForNotebooksSet).toEqual(true);
});