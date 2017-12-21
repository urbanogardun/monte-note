const Store = require('electron-store');
const store = new Store();
const fs = require('fs');
const path = require('path');

export class NotebookManager {

    // Key that holds location value to notebook directory
    static notebookSaveKey: string = 'notebook-save-directory';
    directoryToSaveNotebooksAt: string;
    notebooks: string[];
    
    constructor(saveDir: string) {
        this.directoryToSaveNotebooksAt = saveDir;
        this.saveNotebookLocation(this.directoryToSaveNotebooksAt);
        this.createRootDirectory(this.directoryToSaveNotebooksAt);
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
        this.deleteDirectory(path.join(this.directoryToSaveNotebooksAt, name));
        this.deleteNotebookFromLog(name);
    }

    /** 
     * Deletes all notebooks
     */
    deleteEverything() {
        this.notebooks.map((notebook) => {
            // Delete notebook folder and files in it
            this.deleteNotebook(notebook);
        });
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
    private deleteDirectory(directoryPath: string) {
        if (fs.existsSync(directoryPath)) {
            
            fs.readdirSync(directoryPath).forEach(function(this: NotebookManager, file: string) {
                var curPath = `${directoryPath}/${file}`;
                
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    this.deleteDirectory(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }

            });

            fs.rmdirSync(directoryPath);
        }
    }

    /**
     * Creates root directory inside which notebooks will be created
     * @param  {string} path - directory path
     */
    private createRootDirectory(directoryPath: string) {
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(`${this.directoryToSaveNotebooksAt}`);
        }
    }

}

export default NotebookManager;