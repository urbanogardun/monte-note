import { IpcRenderer, Event } from 'electron';

declare global {
    interface Window {
        require: Function;
    }
}

let ipcRenderer: IpcRenderer;

// Electron's methods are not available outside of electron itself. When we're
// running unit tests and are accessing our application through the web browser
// we'll get an error thrown: window.require is not a function - this try/catch
// suppresses that.
try {
    ipcRenderer = window.require('electron').ipcRenderer;
    
    ipcRenderer.on('start-it!', (event: Event, arg: string) => {
        console.log(arg + '-blah');
    });
} catch (error) {
    ipcRenderer = {} as IpcRenderer;
}

// TODO:
// I configured ipcRenderer to IpcMain and ipcMain to ipcRenderer
// on ipcMain part check if default location for saving notebooks is saved
// if it is not, display welcome screen to set the location
// otherwise display main application page
export class ElectronMessager {

    // Key that holds location value to notebook directory
    static notebooksLocation: string;

    static setLocationForNotebooks(location: string) {
        ElectronMessager.sendMessageWithIpcRenderer(`set-location-for-notebooks: ${location}`);
    }

    static sendMessageWithIpcRenderer(message: string) {
        if (ipcRenderer.send !== undefined) {
            ipcRenderer.send(`is-location-for-notebooks-set`);
        }
    }

    static isLocationForNotebooksSet(): boolean {
        ElectronMessager.sendMessageWithIpcRenderer(`is-location-for-notebooks-set`);
        return false;
    }

}

export default ElectronMessager;