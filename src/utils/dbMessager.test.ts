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

test('messages db & gets a list of notebooks', () => {
    let result = dbMessager.getNotebooks();

    expect(result).toHaveLength(3);
});

test('adds notebook to list of notebooks', () => {
    let notebook = 'test-notebook-123';

    let result = dbMessager.addNotebook(notebook);

    expect(result).toEqual(true);
});