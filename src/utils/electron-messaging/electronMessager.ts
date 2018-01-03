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

export class ElectronMessager {

    static chooseLocationForNotebooks() {
        ElectronMessager.sendMessageWithIpcRenderer(CHOOSE_LOCATION_FOR_NOTEBOOKS);
    }

    static sendMessageWithIpcRenderer(message: string, argument?: any) {
        if (ipcRenderer.send !== undefined) {
            ipcRenderer.send(message, argument);
        }
    }

}

export default ElectronMessager;