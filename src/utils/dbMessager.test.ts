jest.mock('../db/index');
import DbMessager from './dbMessager';

let dbMessager: DbMessager;
beforeAll(() => {
    dbMessager = new DbMessager();
});

beforeEach(() => {
    const NOTEBOOK_LIST = ['test-notebook-cars', 'test-nbook-sea', 'candy-stripes'];
    
    // Load mock database with data
    require('../db/index').Db.__setNotebookList(NOTEBOOK_LIST);
});

test('sets up database', () => {
    expect(dbMessager).toHaveProperty('db');
});

test('messages db & gets a list of notebooks', done => {
    dbMessager.getNotebooks()
    .then((result: string[]) => {
        expect(result).toHaveLength(3);
        done();
    });

});

test('adds notebook to list of notebooks', done => {
    let notebook = 'test-notebook-123';
    dbMessager.addNotebook(notebook)
    .then((result: boolean) => {
        done();
        expect(result).toEqual(true);
    });
});

test('adds location for notebooks to db', () => {
    let location = 'C:\\test-dir';
    require('../db/index').Db.__setNotebooksLocation(location);
    let notebooksLocation = require('../db/index').Db.notebooksLocation;
    
    dbMessager.setNotebooksLocation(location);
    expect(notebooksLocation).toEqual(location);
});

test('adds all existing notebooks to db', done => {

    let notebooksToBeAdded = ['ex-nb-1', 'ex-nb-2', 'ex-nb-3'];
    
    dbMessager.addExistingNotebooks(notebooksToBeAdded)
    .then(() => {
        let notebooksInDb = require('../db/index').Db.__getNotebooksList();
        expect(notebooksInDb).toContain(notebooksToBeAdded[1]);
        done();
    });

});

test('initializes and returns a settings object', done => {
    dbMessager.loadSettings()
    .then((settings: any) => {
        done();
        expect(settings).toHaveProperty('notebooksLocation');
    });
});

test('updates an item in settings object', done => {
    let testDir = 'test-dir';
    dbMessager.updateSettings('notebooksLocation', testDir)
    .then((result: any) => {
        done();
        expect(result).toEqual(true);
    });
});

test('gets item from the settings object', done => {
    let item = 'notebooksLocation';
    dbMessager.getFromSettings(item)
    .then((value: string) => {
        done();
        expect(value).toEqual('');
    });
});

test('sets lastOpenedNote value for a notebook', done => {
    let notebookName = 'testNotebook';
    let lastOpenedNote = 'test-note-23';

    dbMessager.setLastOpenedNote(notebookName, lastOpenedNote)
    .then((result: boolean) => {
        done();
        expect(result).toEqual(true);
    });
});

test('gets last opened note of a notebook from db', done => {
    let notebookName = 'testNotebook';

    dbMessager.getLastOpenedNote(notebookName)
    .then((note: string) => {
        done();
        expect(note).toEqual('test-note-23');
    });
});

test('creates document for a specific notebook', done => {
    let notebookName = 'testNotebook';

    dbMessager.createNotebook(notebookName)
    .then((result: boolean) => {
        done();
        expect(result).toEqual(true);
    });
});

test('adds note to notebook document', done => {
    let notebookName = 'testNotebook';
    let noteName = 'test-note';

    dbMessager.addNoteToNotebook(notebookName, noteName)
    .then((result: boolean) => {
        done();
        expect(result).toEqual(true);
    });
});