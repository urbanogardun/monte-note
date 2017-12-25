import { enthusiasmLevel, notebooksLocation } from './index';
import { incrementEnthusiasm, decrementEnthusiasm, setNotebooksLocation } from '../actions/index';
import { StoreState } from '../types/index';

let storeState: StoreState = {
    enthusiasmLevel: 1,
    notebooksLocation: '',
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