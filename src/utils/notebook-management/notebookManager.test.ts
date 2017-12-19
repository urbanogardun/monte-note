import NotebookManager from './notebookManager';

let notebookManager: NotebookManager;
let testNotebook = 'chemistry';
beforeAll(() => {
  // Set notebook directory location as current working directory
  notebookManager = new NotebookManager(process.cwd());
});

test('gets notebook directory location', () => {
  expect(notebookManager.getNotebookLocation()).toEqual(process.cwd());
});

test('creates notebook', () => {
  notebookManager.addNotebook(testNotebook);

  expect(notebookManager.notebooks).toContain(testNotebook);
});

test('deletes a notebook', () => {
  notebookManager.deleteNotebook(testNotebook);

  expect(notebookManager.notebooks).not.toContain(testNotebook);
});
