"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const dbMessager_1 = require("../dbMessager");
class NotebookManager {
    constructor() {
        // NotebookManager.directoryToSaveNotebooksAt = saveDir;
        // this.createRootDirectory(NotebookManager.directoryToSaveNotebooksAt);
        // let notebooksList = this.getNotebooks();
        this.notebooks = [];
        this.DbConnection = new dbMessager_1.default();
        // this.DbConnection.setNotebooksLocation(saveDir);
    }
    /**
     * @returns string - location of save directory
     */
    static getNotebookLocation() {
        return NotebookManager.directoryToSaveNotebooksAt;
        // return store.get(NotebookManager.notebookSaveKey);
    }
    getNotebooksLocation() {
        return new Promise(resolve => {
            this.DbConnection.getNotebooksLocation()
                .then((location) => {
                NotebookManager.directoryToSaveNotebooksAt = location;
                resolve(location);
            });
        });
    }
    loadExistingNotebooksIntoApp() {
        return new Promise(resolve => {
            let notebooks = this.getNotebooks();
            this.DbConnection.addExistingNotebooks(notebooks)
                .then((result) => {
                resolve(result);
            });
        });
    }
    setNotebooksLocation(location) {
        return new Promise(resolve => {
            this.DbConnection.setNotebooksLocation(location)
                .then((result) => {
                resolve(result);
            });
        });
    }
    // TODO:
    // After notebook dir is created, add notebook name to DB
    addNotebook(name) {
        return new Promise(resolve => {
            if (this.notebookExists(name)) {
                try {
                    fs.mkdir(`${NotebookManager.directoryToSaveNotebooksAt}\\${name}`, () => {
                        this.addNotebookToLog(name);
                        this.DbConnection.addNotebook(name)
                            .then((result) => {
                            resolve(result);
                        });
                    });
                }
                catch (error) {
                    return resolve(false);
                }
            }
            else {
                resolve(false);
            }
        });
    }
    deleteNotebook(name) {
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
        return fs.readdirSync(NotebookManager.directoryToSaveNotebooksAt).filter(function (file) {
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
    notebookExists(name) {
        return (!fs.existsSync(`${NotebookManager.directoryToSaveNotebooksAt}\\${name}`));
    }
    /**
     * Keeps track of notebooks that were created during a session
     * @param  {string} name - notebook name
     */
    addNotebookToLog(name) {
        if (this.notebooks.indexOf(name) === -1) {
            this.notebooks.push(name);
        }
    }
    /**
     * Removes notebook from log
     * @param  {string} name - notebook name
     */
    deleteNotebookFromLog(name) {
        this.notebooks = this.notebooks.filter((val) => val !== name);
    }
    /**
     * Deletes a directory and all files in it
     * @param  {string} path - path to directory
     */
    deleteDirectory(directoryPath) {
        if (fs.existsSync(directoryPath)) {
            fs.readdirSync(directoryPath).forEach(function (file) {
                var curPath = `${directoryPath}/${file}`;
                if (fs.lstatSync(curPath).isDirectory()) {
                    this.deleteDirectory(curPath);
                }
                else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(directoryPath);
        }
    }
}
// Key that holds location value to notebook directory
NotebookManager.notebookSaveKey = 'notebook-save-directory';
exports.NotebookManager = NotebookManager;
exports.default = NotebookManager;
