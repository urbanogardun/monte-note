const fs = require('fs');
const path = require('path');
import DbMessager from '../dbMessager';

export class NotebookManager {

    // Key that holds location value to notebook directory
    static notebookSaveKey: string = 'notebook-save-directory';
    static directoryToSaveNotebooksAt: string;
    notebooks: string[];
    DbConnection: DbMessager;

    /**
     * @returns string - location of save directory
     */
    static getNotebookLocation(): string {
        return NotebookManager.directoryToSaveNotebooksAt;
        // return store.get(NotebookManager.notebookSaveKey);
    }

    static getNotebooks(directory: string) {
        return fs.readdirSync(directory).filter(function(file: string) {
            return fs.statSync(directory + '/' + file).isDirectory();
        });
    }

    static addNotebook(location: string, name: string) {
        return new Promise(resolve => {
            try {
                fs.mkdir(`${location}\\${name}`, () => {
                    resolve(true);
                });
            } catch (error) {
                return resolve(false);
            }
        });
    }

    static addNote(location: string, name: string) {
        return new Promise(resolve => {
            try {
                fs.writeFile(`${location}\\${name}.html`, '', (err: Error) => {
                    if (err) {
                        resolve(false);
                    }
                    resolve(true);
                });
            } catch (error) {
                return resolve(false);
            }
        });
    }

    static getNotes(location: string) {
        return new Promise(resolve => {
            fs.readdir(`${location}`, (err: Error, files: string[]) => {
                files = files.filter((file: string) => { return file.endsWith('.html'); });
                resolve(files);
            });
        });
    }

    static getNotesCreationDate(location: string, notes: string[]) {
        return new Promise(resolve => {
            let data = {};
            let itemsProcessed = 0;

            // Sets each file to have an absolute path before getting stats
            notes.map((file: string) => { return path.join(location, file); })
            .forEach((note: string, index: number) => {
                fs.stat(note, (err: Error, stats: any) => {
                    itemsProcessed++;
                    data[notes[index]] = {created_at: stats.ctime};
                    
                    if (itemsProcessed === notes.length) {
                        resolve(data);
                    }
                });
            });
        });
    }

    constructor() {
        // NotebookManager.directoryToSaveNotebooksAt = saveDir;
        // this.createRootDirectory(NotebookManager.directoryToSaveNotebooksAt);
        // let notebooksList = this.getNotebooks();
        this.notebooks = [];
        this.DbConnection = new DbMessager();
        // this.DbConnection.setNotebooksLocation(saveDir);
    }

    getNotebooksLocation() {
        return new Promise(resolve => {
            this.DbConnection.getNotebooksLocation()
            .then((location: string) => {
                NotebookManager.directoryToSaveNotebooksAt = location;
                resolve(location);
            });
        });
    }

    loadExistingNotebooksIntoApp() {
        return new Promise(resolve => {
            let notebooks = this.getNotebooks();
            this.DbConnection.addExistingNotebooks(notebooks)
            .then((result: boolean) => {
                resolve(result);
            });
        });
    }

    setNotebooksLocation(location: string) {
        return new Promise(resolve => {
            this.DbConnection.setNotebooksLocation(location)
            .then((result: boolean) => {
                resolve(result);
            });
        });
    }

    // TODO:
    // After notebook dir is created, add notebook name to DB
    addNotebook(name: string): any {
        return new Promise(resolve => {
            if (this.notebookExists(name)) {
                try {
                    fs.mkdir(`${NotebookManager.directoryToSaveNotebooksAt}\\${name}`, () => {
                        this.addNotebookToLog(name);
                        this.DbConnection.addNotebook(name)
                        .then((result: boolean) => {
                            resolve(result);
                        });
                    });
                } catch (error) {
                    return resolve(false);
                }
            } else {
                resolve(false);
            }
        });
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
    // private saveNotebookLocation(location: string) {
    //     store.set(NotebookManager.notebookSaveKey, location);
    // }
    
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
    // private createRootDirectory(directoryPath: string) {
    //     if (!fs.existsSync(directoryPath)) {
    //         fs.mkdirSync(`${NotebookManager.directoryToSaveNotebooksAt}`);
    //     }
    // }

}

export default NotebookManager;