import { IpcRenderer, Event } from 'electron';
import { NOTEBOOK_SAVE_DIRECTORY } from '../../utils/constants';
import reduxStore from '../../store/index';
import * as actions from '../../actions/';
    
let ipcRenderer: IpcRenderer;

// Electron's methods are not available outside of electron itself. When we're
// running unit tests and are accessing our application through the web browser
// we'll get an error thrown: window.require is not a function - this try/catch
// suppresses that.
export function ipcRendererEventsBootstrap() {
    try {
        ipcRenderer = window.require('electron').ipcRenderer;
        
        ipcRenderer.on('start-it!', (event: Event, arg: string): boolean => {
            if (arg) {
                return true;
            } else {
                return false;
            }
        });

        ipcRenderer.on('location-for-notebooks', (event: Event, arg: string): void => {
            if (arg) {
                reduxStore.dispatch(actions.incrementEnthusiasm());
                localStorage.setItem(NOTEBOOK_SAVE_DIRECTORY, arg);
            }
        });

    } catch (error) {
        ipcRenderer = {} as IpcRenderer;
    } finally {
        return ipcRenderer;
    }
}
