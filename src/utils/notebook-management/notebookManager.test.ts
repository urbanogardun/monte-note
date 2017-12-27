import NotebookManager from './notebookManager';

let notebookManager: NotebookManager;
let testNotebook = 'chemistry';
beforeAll(() => {
  // Set notebook directory location as current working directory
  notebookManager = new NotebookManager(process.cwd() + '\\testing');
});

test('gets notebook directory location', () => {
  expect(NotebookManager.getNotebookLocation()).toEqual(process.cwd() + '\\testing');
});

test('creates notebook', () => {
  notebookManager.addNotebook(testNotebook);

  expect(notebookManager.notebooks).toContain(testNotebook);
});

test('deletes a notebook', () => {
  notebookManager.deleteNotebook(testNotebook);

  expect(notebookManager.notebooks).not.toContain(testNotebook);
});

test('deletes all notebooks', () => {
  notebookManager.addNotebook(testNotebook + '-industrial');
  notebookManager.addNotebook(testNotebook + '-biology');
  notebookManager.addNotebook(testNotebook + '-organic');

  notebookManager.deleteEverything();

  expect(notebookManager.notebooks).toHaveLength(0);
});

test('gets all notebooks inside notebooks location directory', () => {
  notebookManager.addNotebook(testNotebook + '-lalaland');
  notebookManager.addNotebook(testNotebook + '-blam');

  expect(notebookManager.getNotebooks()).toHaveLength(2);
});

afterAll(() => {
  notebookManager.deleteEverything();
});