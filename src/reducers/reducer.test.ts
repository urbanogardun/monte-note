import { enthusiasmLevel, notebooksLocation, notebooks, notes, lastOpenedNote, noteContent } from './index';
import { incrementEnthusiasm, 
    decrementEnthusiasm, 
    setNotebooksLocation, 
    getNotebooks, 
    addNote,
    loadNotes,
    loadLastOpenedNote,
    loadContentIntoNote } from '../actions/index';
import { StoreState } from '../types/index';

let storeState: StoreState = {
    enthusiasmLevel: 1,
    notebooksLocation: '',
    notebooks: [],
    notes: [],
    lastOpenedNote: '',
    noteContent: '',
};

beforeEach(() => {
    storeState.enthusiasmLevel = 1;
});

it('increments enthusiasm level', () => {
    let enthusiasmLevelNew = enthusiasmLevel(storeState, incrementEnthusiasm());

    expect(enthusiasmLevelNew).toEqual(2);
});

it('decrements enthusiasm level', () => {
    let enthusiasmLevelNew = enthusiasmLevel(storeState, decrementEnthusiasm());

    expect(enthusiasmLevelNew).toEqual(1);
});

it('sets notebooks location', () => {
    let notebooksLocationNew = notebooksLocation(storeState, setNotebooksLocation('test-location'));

    expect(notebooksLocationNew).toEqual('test-location');
});

it('returns list of notebooks', () => {
    let notebooksList = ['nbook-1', 'nbook-2', 'nbook-3'];

    let result = notebooks(storeState, getNotebooks(notebooksList));

    expect(result).toHaveLength(3);
});

it('adds a note', () => {
    let noteToAdd = 'note-test';

    let result = notes(storeState.notes as StoreState, addNote(noteToAdd));

    expect(result).toContain(noteToAdd);
});

it('loads list of notes', () => {
    let noteList = ['note-1', 'note-2', 'note-3'];

    let result = notes(storeState, loadNotes(noteList));

    expect(result).toHaveLength(3);
});

it('returns last opened note', () => {
    let noteName = 'test-note-23';

    let result = lastOpenedNote(storeState, loadLastOpenedNote(noteName));

    expect(result).toEqual(noteName);
});

it('returns note content', () => {
    let noteData = '<p>Test content</p>';

    let result = noteContent(storeState, loadContentIntoNote(noteData));

    expect(result).toEqual(noteData);
});