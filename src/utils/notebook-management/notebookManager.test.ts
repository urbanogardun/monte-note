jest.mock('../dbMessager');
jest.mock('fs');
import NotebookManager from './notebookManager';
import { DbMessager } from '../dbMessager';

let notebookManager: NotebookManager;
let testNotebook = 'chemistry';
beforeAll(done => {
  // Set notebook directory location as current working directory
  notebookManager = new NotebookManager();
  notebookManager.setNotebooksLocation(process.cwd() + '\\testing')
  .then(() => {
    done();
  });

});

beforeEach(() => {
  const NOTEBOOK_LIST = [testNotebook, testNotebook];
  require('fs').__setNotebookList(NOTEBOOK_LIST);
});

test('gets notebook directory location', done => {

    notebookManager.getNotebooksLocation()
    .then(result => {
      done();
      expect(result).toEqual(process.cwd() + '\\testing');
    });

});

test('creates notebook', done => {
  notebookManager.addNotebook(testNotebook)
  .then(() => {
    done();
    expect(notebookManager.notebooks).toContain(testNotebook);
  });
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

test('loads all existing notebooks into the db', done => {
  let dbMessager = new DbMessager();
  notebookManager.loadExistingNotebooksIntoApp()
  .then(() => {
    let notebooks = dbMessager.getNotebooks();
    expect(notebooks).toHaveLength(2);
    done();
  });
});

test('returns all existing notebooks in chosen dir', () => {
  let dir = 'test-dir';
  let result = NotebookManager.getNotebooks(dir);
  expect(result).toHaveLength(2);
});

test('creates note page file', done => {
  let locationToNotebook = 'C:\\test-dir\\test-notebook';
  NotebookManager.addNote(locationToNotebook, 'test-note-page')
  .then((result: boolean) => {
    done();
    expect(result).toEqual(true);
  });
});

afterEach(() => {
  notebookManager.deleteEverything();
});
