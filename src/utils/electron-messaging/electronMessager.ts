import { IpcRenderer } from 'electron';
import { ipcRendererEventsBootstrap } from './ipcRendererEventsBootstrap';

declare global {
    interface Window {
        require: Function;
    }
}

let ipcRenderer: IpcRenderer;

ipcRenderer = ipcRendererEventsBootstrap();

// TODO:
// I configured ipcRenderer to IpcMain and ipcMain to ipcRenderer
// on ipcMain part check if default location for saving notebooks is saved
// if it is not, display welcome screen to set the location
// otherwise display main application page
export class ElectronMessager {

    // Key that holds location value to notebook directory
    static notebooksLocation: string;

    static chooseLocationForNotebooks() {
        ElectronMessager.sendMessageWithIpcRenderer(`choose-location-for-notebooks`);
    }

    static setLocationForNotebooks(location: string) {
        ElectronMessager.sendMessageWithIpcRenderer(`set-location-for-notebooks: ${location}`);
    }

    static sendMessageWithIpcRenderer(message: string) {
        if (ipcRenderer.send !== undefined) {
            ipcRenderer.send(message);
        }
    }

    static isLocationForNotebooksSet(): boolean {
        ElectronMessager.sendMessageWithIpcRenderer(`is-location-for-notebooks-set`);
        return false;
    }

}

export default ElectronMessager;