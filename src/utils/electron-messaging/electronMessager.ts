import { IpcRenderer } from 'electron';
import { ipcRendererEventsBootstrap } from './ipcRendererEventsBootstrap';
import { CHOOSE_LOCATION_FOR_NOTEBOOKS } from '../../utils/constants';

declare global {
    interface Window {
        require: Function;
    }
}

let ipcRenderer: IpcRenderer;

ipcRenderer = ipcRendererEventsBootstrap();

// TODO:
// Create constants for electron messenger messages sent with IPC renderer
export class ElectronMessager {

    static chooseLocationForNotebooks() {
        ElectronMessager.sendMessageWithIpcRenderer(CHOOSE_LOCATION_FOR_NOTEBOOKS);
    }

    static sendMessageWithIpcRenderer(message: string) {
        if (ipcRenderer.send !== undefined) {
            ipcRenderer.send(message);
        }
    }

}

export default ElectronMessager;