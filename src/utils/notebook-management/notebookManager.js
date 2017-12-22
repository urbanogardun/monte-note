"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Store = require('electron-store');
const store = new Store();
const fs = require('fs');
const path = require('path');
class NotebookManager {
    constructor(saveDir) {
        NotebookManager.directoryToSaveNotebooksAt = saveDir;
        this.saveNotebookLocation(NotebookManager.directoryToSaveNotebooksAt);
        this.createRootDirectory(NotebookManager.directoryToSaveNotebooksAt);
        this.notebooks = [];
    }
    /**
     * @returns string - location of save directory
     */
    static getNotebookLocation() {
        return store.get(NotebookManager.notebookSaveKey);
    }
    static setNotebooksLocation(location) {
        store.set(NotebookManager.notebookSaveKey, location);
    }
    addNotebook(name) {
        if (this.notebookExists(name)) {
            fs.mkdirSync(`${NotebookManager.directoryToSaveNotebooksAt}\\${name}`);
        }
        this.addNotebookToLog(name);
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
     * Sets default directory where notebooks will get saved
     * @param  {string} location - directory for notebooks
     */
    saveNotebookLocation(location) {
        store.set(NotebookManager.notebookSaveKey, location);
    }
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
    /**
     * Creates root directory inside which notebooks will be created
     * @param  {string} path - directory path
     */
    createRootDirectory(directoryPath) {
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(`${NotebookManager.directoryToSaveNotebooksAt}`);
        }
    }
}
// Key that holds location value to notebook directory
NotebookManager.notebookSaveKey = 'notebook-save-directory';
exports.NotebookManager = NotebookManager;
exports.default = NotebookManager;
