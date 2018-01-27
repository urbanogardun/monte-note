jest.mock('../dbMessager');
jest.mock('fs-extra');
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
  require('fs-extra').__setNotebookList(NOTEBOOK_LIST);
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

test('gets all note files in a directory of a notebook', done => {
  let notebookLocation = 'C:\\notebooks\\test-nbook-1';
  NotebookManager.getNotes(notebookLocation)
  .then((notes: string[]) => {
    done();
    expect(notes).toHaveLength(4);
  });
});

test('gets created date for files in array', done => {
  let notes = [
    'C:\\notebooks\\test-nbook-1\\note-1\\index.html', 
    'C:\\notebooks\\test-nbook-1\\note-2\\index.html', 
    'C:\\notebooks\\test-nbook-1\\note-3\\index.html', 
    'C:\\notebooks\\test-nbook-1\\note-4\\index.html'];

  NotebookManager.getNotesCreationDate(notes)
  .then((result: any) => {
    done();
    expect(result[notes[0]]).toHaveProperty('created_at');
  });
});

test('sorts notebooks object by a property value that we specify', () => {
  let notesObj = {
    'biggie.html': {'created_at' : '2018-01-03T20:48:45.829Z'},
    'bureks.html' : {'created_at' : '2018-01-03T20:58:53.438Z'},
    'coffee.html' : {'created_at' : '2018-01-03T19:27:05.350Z'},
    'fishie-2.html' : {'created_at' : '2018-01-04T11:40:56.495Z'},
    'fishies.html' : {'created_at' : '2018-01-03T20:58:47.675Z'}
  };

  let result = NotebookManager.orderNotesBy(notesObj, 'created_at');

  expect(result[4]).toEqual('fishie-2.html');
});

test('gets name of note from last directory path in a string', () => {
  let result = NotebookManager
  .formatNoteName('C:\\Users\\seneca\\Documents\\my-notebooks\\Women\\Favorites\\index.html');

  expect(result).toEqual('Favorites');
});

test('pretty formats note list', () => {
  let notes = [
    'C:\\Users\\seneca\\Documents\\my-notebooks\\Women\\fishie-2\\index.html', 
    'C:\\Users\\seneca\\Documents\\my-notebooks\\Women\\coffee\\index.html', 
    'C:\\Users\\seneca\\Documents\\my-notebooks\\Women\\bikes\\index.html'];

  let result = NotebookManager.formatNotes(notes);

  expect(result).toEqual(['fishie-2', 'coffee', 'bikes']);
});

test('writes data to note', done => {
  let absolutePathToNote = 'C:\\notebooks\\test-nbook-1\\testNote.html';
  let noteData = '<h1>Test Content</h1>';

  NotebookManager.updateNoteData(absolutePathToNote, noteData)
  .then((result: boolean) => {
    done();
    expect(result).toEqual(true);
  });

});

test('gets data from note', done => {
  let absolutePathToNote = 'C:\\notebooks\\test-nbook-1\\testNote.html';

  NotebookManager.getNoteData(absolutePathToNote)
  .then((result: string) => {
    done();
    expect(result).toBeTruthy();
  });
});

test('moves note to trash can', done => {
  let noteName = 'testNote.html';
  let notebookname = 'test-nbook-1';
  let notebooksLocation = 'C:\\notebooks';

  NotebookManager.trashNote(notebooksLocation, notebookname, noteName)
  .then((result: boolean) => {
    done();
    expect(result).toEqual(true);
  });

});

test('gets notes mapped to corresponding notebooks from .trashcan directory', done => {
  let notebooksLocation = 'C:\\notebooks\\';
  let trashedNotebook = 'chemistry';

  NotebookManager.getTrash(notebooksLocation)
  .then((result: object) => {
    done();
    expect(result).toHaveProperty(trashedNotebook);
  });

});

test('restores note from .trashcan directory', done => {
  let noteName = 'testNote.html';
  let notebookName = 'test-nbook-1';
  let notebooksLocation = 'C:\\notebooks';

  NotebookManager.restoreNoteFromTrash(notebooksLocation, notebookName, noteName)
  .then((result: boolean) => {
    done();
    expect(result).toEqual(true);
  });

});

test('deletes note from drive inside the .trashcan directory', done => {
  let noteName = 'testNote.html';
  let notebookName = 'test-nbook-1';
  let notebooksLocation = 'C:\\notebooks';

  NotebookManager.destroyNote(notebooksLocation, notebookName, noteName)
  .then((result: boolean) => {
    done();
    expect(result).toEqual(true);
  });

});

test('saves image data to assets/images directory', done => {
  let noteName = 'testNote';
  let notebookName = 'test-nbook-1';
  let notebooksLocation = 'C:\\notebooks';
  let imageFilename = 'photo.jpg';
  let imageDataBase64 = 'test';

  let noteLocation = {
    notebooksLocation: notebooksLocation,
    notebook: notebookName,
    note: noteName
  };

  NotebookManager.saveImage(noteLocation, imageFilename, imageDataBase64)
  .then((result: boolean) => {
    done();
    expect(result).toContain('.jpg');
  });
});

test('creates directory for notebooks', done => {
  let notebooksLocation = 'C:\\Users\\seneca\\Documents\\my-notebooks';

  NotebookManager.createNotebooksDirectory(notebooksLocation)
  .then((result: string) => {
    done();
    expect(result).toEqual('C:\\Users\\seneca\\Documents\\my-notebooks\\NinjaNote Notebooks');
  });

});

test('changes absolute path of note attachment images', done => {
  let newNotebooksLocation = 'C:\\Users\\seneca\\Documents\\my-notebooks';

  NotebookManager.relinkAttachmentContent(newNotebooksLocation)
  .then((result: boolean) => {
    done();
    expect(result).toEqual(true);
  });

});

afterEach(() => {
  notebookManager.deleteEverything();
});
