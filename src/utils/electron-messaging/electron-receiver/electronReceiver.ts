import { ipcMain } from 'electron';
import NotebookManager from '../../notebook-management/notebookManager';

export default class ElectronReceiver {

    notebookManager: NotebookManager;

    receiveMessage(message: string) {
        ipcMain.on(message, () => {
            
            if (this.isLocationForNotebooks(message)) {
                this.parseLocationForNotebooks(message);
                this.createLocationForNotebooks(message);
            } else {
                // console.log('Process other');
            }
        });
    }

    /**
     * Extracts from message path for notebooks location
     * @param  {string} message
     * @returns string - Extracted location
     */
    parseLocationForNotebooks(message: string): string {
        let location = message
                        .split('set-location-for-notebooks:')
                        .join(' ')
                        .trim();
        return location;
    }
    /**
     * Creates directory where notebooks will be stored
     * @param  {string} location
     */
    createLocationForNotebooks(location: string) {
        this.notebookManager = new NotebookManager(location);
        return this.notebookManager;
    }

    private isLocationForNotebooks(message: string): boolean {
        if (message.includes('set-location-for-notebooks')) {
            return true;
        }

        return false;
    }
}
