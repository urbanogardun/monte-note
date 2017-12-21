import { ipcMain } from 'electron';
// import NotebookManager from '../../notebook-management/notebookManager';

export default class ElectronReceiver {

    notebooks: string[];
    
    constructor() {
        this.notebooks = [];
    }

    receiveMessage(message: string) {
        ipcMain.on(message, () => {
            
            if (message.includes('set-location-for-notebooks')) {
                // message.split(':')
                // notebookManager = new NotebookManager()
            } else {
                console.log('Process other');
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
}
