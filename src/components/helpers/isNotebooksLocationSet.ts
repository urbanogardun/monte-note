const Store = require('electron-store');
const store = new Store();

export function isNotebooksLocationSet() {
    let location = store.get('notebooks-location');

    if (location === undefined) {
        return false;
    }

    return true;
}