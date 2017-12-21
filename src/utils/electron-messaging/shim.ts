// In order to talk to Electron's main process using our component, we have to
// import Electron's ipcRenderer module. If we run our application outside of
// Electron such as in browser or we run a suite of tests on it an error
// `window.require is not a function` gets thrown. This shim suppresses that
// error.

interface IpcRendererMock {
    send: Function;
}

export class IpcRendererShim {

    ipcRenderer: IpcRendererMock;

    constructor() {

        try {
            this.ipcRenderer = window.require('electron').ipcRenderer;
        } catch (error) {
            return;
        }
    }

    send(message: string) {
        if (this.ipcRenderer === undefined) {
            // throw 'ipcRenderer is not available outside of Electron.';
            return message;
        } else {
            this.ipcRenderer.send(message);
        }
    }

}
