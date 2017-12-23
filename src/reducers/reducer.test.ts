import { enthusiasm } from './index';
import { incrementEnthusiasm, decrementEnthusiasm } from '../actions/index';
import { StoreState } from '../types/index';

let storeState: StoreState = {
    enthusiasmLevel: 1,
    languageName: 'TypeScript',
    notebooksLocation: '',
};

beforeEach(() => {
    storeState.enthusiasmLevel = 1;
});

it('increments enthusiasm level', () => {
    storeState = enthusiasm(storeState, incrementEnthusiasm());

    expect(storeState.enthusiasmLevel).toEqual(2);
});

it('decrements enthusiasm level', () => {
    storeState = enthusiasm(storeState, decrementEnthusiasm());

    expect(storeState.enthusiasmLevel).toEqual(1);
});
