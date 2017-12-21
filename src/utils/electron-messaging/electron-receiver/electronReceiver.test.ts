import ElectronReceiver from './electronReceiver';

let electronReceiver: ElectronReceiver;
beforeAll(() => {
    electronReceiver = new ElectronReceiver();
});

// test('notifies that notebook location has not been set', () => {
//     let message = electronReceiver.receiveMessage('test message');

//     expect(message).toEqual('book');
// });

test('parses location from received ipcRenderer message', () => {
    let message = electronReceiver.parseLocationForNotebooks('set-location-for-notebooks: C:/test-dir');

    expect(message).toEqual('C:/test-dir');
});