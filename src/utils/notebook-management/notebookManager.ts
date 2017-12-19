const Store = require('electron-store');
const store = new Store();
const fs = require('fs');

export class NotebookManager {

    // Key that holds location value to notebook directory
    static notebookSaveKey: string = 'notebook-save-directory';
    directoryToSaveNotebooksAt: string;
    notebooks: string[];
    
    constructor(saveDir: string) {
        this.directoryToSaveNotebooksAt = saveDir;
        this.saveNotebookLocation(this.directoryToSaveNotebooksAt);
        this.notebooks = [];
    }

    /**
     * @returns string - location of save directory
     */
    getNotebookLocation(): string {
        return store.get(NotebookManager.notebookSaveKey);
    }

    addNotebook(name: string) {
        if (this.notebookExists(name)) {
            fs.mkdirSync(`${this.directoryToSaveNotebooksAt}\\${name}`);
        }
        this.addNotebookToLog(name);
    }

    deleteNotebook(name: string) {
        this.deleteDirectory(name);
        this.deleteNotebookFromLog(name);
    }

    /**
     * Sets default directory where notebooks will get saved
     * @param  {string} location - directory for notebooks
     */
    private saveNotebookLocation(location: string) {
        store.set(NotebookManager.notebookSaveKey, location);
    }
    
    /**
     * Checks if notebook is already created
     * @param  {string} name - notebook name
     * @returns boolean
     */
    private notebookExists(name: string): boolean {
        return (!fs.existsSync(`${this.directoryToSaveNotebooksAt}\\${name}`));
    }

    /**
     * Keeps track of notebooks that were created during a session
     * @param  {string} name - notebook name
     */
    private addNotebookToLog(name: string) {
        if (this.notebooks.indexOf(name) === -1) {
            this.notebooks.push(name);
        }
    }

    /**
     * Removes notebook from log
     * @param  {string} name - notebook name
     */
    private deleteNotebookFromLog(name: string) {
        this.notebooks = this.notebooks.filter((val) => val !== name);
    }

    /**
     * Deletes a directory and all files in it
     * @param  {string} path - path to directory
     */
    private deleteDirectory(path: string) {
        if (fs.existsSync(path)) {
            
            fs.readdirSync(path).forEach(function(this: NotebookManager, file: string) {
                var curPath = `${path}/${file}`;
                
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    this.deleteDirectory(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }

            });

            fs.rmdirSync(path);
        }
    }

}

export default NotebookManager;