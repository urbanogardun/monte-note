jest.mock('../../notebook-management/notebookManager');
import ElectronReceiver from './electronReceiver';
import * as path from 'path';
import * as fs from 'fs';

let electronReceiver: ElectronReceiver;
let testDir = path.join(process.cwd(), 'testing-electron-receiver');
beforeAll(() => {
    electronReceiver = new ElectronReceiver();
});

test('notifies that notebook location has not been set', () => {
    const spy = jest.spyOn(electronReceiver, 'receiveMessage');
    
    electronReceiver.receiveMessage('set-location-for-notebooks: C:/test-dir');

    expect(spy).toHaveBeenCalled();
});

test('parses location from received ipcRenderer message', () => {
    let message = electronReceiver.parseLocationForNotebooks('set-location-for-notebooks: C:/test-dir');

    expect(message).toEqual('C:/test-dir');
});

test('creates main directory for notebooks', () => {
    electronReceiver.createLocationForNotebooks(testDir);

    let directoryExists = fs.existsSync(testDir);

    expect(directoryExists).toEqual(true);
});

afterAll(() => {
    fs.rmdirSync(testDir);
});