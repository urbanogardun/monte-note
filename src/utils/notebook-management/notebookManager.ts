const Store = require('electron-store');
const store = new Store();
const fs = require('fs');
const path = require('path');
import db from '../../db/index';

export class NotebookManager {

    // Key that holds location value to notebook directory
    static notebookSaveKey: string = 'notebook-save-directory';
    static directoryToSaveNotebooksAt: string;
    notebooks: string[];

    /**
     * @returns string - location of save directory
     */
    static getNotebookLocation(): string {
        return store.get(NotebookManager.notebookSaveKey);
    }

    constructor(saveDir: string) {
        NotebookManager.directoryToSaveNotebooksAt = saveDir;
        this.saveNotebookLocation(NotebookManager.directoryToSaveNotebooksAt);
        this.createRootDirectory(NotebookManager.directoryToSaveNotebooksAt);
        this.notebooks = [];

        let notebooksList = this.getNotebooks();
        console.log('nlist: ' + notebooksList);

        // Bootstrap db with notebooks entry
        db.find({ name: 'notebooks' }, function (err: any, docs: any) {
            console.log(docs.length);
            if (docs.length === 0) {
                db.insert({ name: 'notebooks', notebooks: notebooksList });
            }
        });
        // db.insert({ name: 'notebooks' }, { notebooks: notebooksList });
    }

    // TODO:
    // After notebook dir is created, add notebook name to DB
    addNotebook(name: string) {
        if (this.notebookExists(name)) {
            try {
                fs.mkdir(`${NotebookManager.directoryToSaveNotebooksAt}\\${name}`, () => {
                    this.addNotebookToLog(name);
                    console.log('notebook created!');
                    db.update({ name: 'notebooks' }, { $push: { notebooks: name } });
                });
            } catch (error) {
                return;
            }
        }
    }

    deleteNotebook(name: string) {
        this.deleteDirectory(path.join(NotebookManager.directoryToSaveNotebooksAt, name));
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
     * Gets all notebooks
     */
    getNotebooks() {
        return fs.readdirSync(NotebookManager.directoryToSaveNotebooksAt).filter(function(file: string) {
            return fs.statSync(NotebookManager.directoryToSaveNotebooksAt + '/' + file).isDirectory();
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
        return (!fs.existsSync(`${NotebookManager.directoryToSaveNotebooksAt}\\${name}`));
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
            fs.mkdirSync(`${NotebookManager.directoryToSaveNotebooksAt}`);
        }
    }

}

export default NotebookManager;