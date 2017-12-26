import ElectronMessager from './electronMessager';
// import { NOTEBOOK_SAVE_DIRECTORY } from '../constants';

// Jest uses jsdom for testing. Since jsdom doesn't have localStorage we import
// a mock of it.
beforeAll(() => {
  const ls = require('../localStorage');
  ls.setLocalStorage();
});

test('sends message from renderer process', () => {
  const spy = jest.spyOn(ElectronMessager, 'sendMessageWithIpcRenderer');
  ElectronMessager.sendMessageWithIpcRenderer('test message');

  expect(spy).toHaveBeenCalled();
});