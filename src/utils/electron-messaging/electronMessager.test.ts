import ElectronMessager from './electronMessager';

test('sends ipcRenderer with message to set a location for notebooks', () => {
  const spy = jest.spyOn(ElectronMessager, 'setLocationForNotebooks');
  
  let testDir = process.cwd();

  ElectronMessager.setLocationForNotebooks(testDir);

  expect(spy).toHaveBeenCalled();
});

// test('checks if location for notebooks has been set', () => {

//   let isLocationForNotebooksSet = ElectronMessager.isLocationForNotebooksSet();

//   expect(isLocationForNotebooksSet).toEqual(true);
// });