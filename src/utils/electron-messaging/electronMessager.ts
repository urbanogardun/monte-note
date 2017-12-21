import { IpcRendererShim } from './shim';

declare global {
    interface Window {
        require: Function;
    }
}

let ipcRenderer = new IpcRendererShim();

export interface Props {
    name?: string;
    enthusiasmLevel?: number;
}

export class ElectronMessager {

    // Key that holds location value to notebook directory
    static notebooksLocation: string;

    static setLocationForNotebooks(location: string) {
        ipcRenderer.send(`set-location-for-notebooks: ${location}`);
    }

}

export default ElectronMessager;