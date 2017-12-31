"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const Store = require('electron-store');
// const store = new Store();
const fs = require('fs');
const path = require('path');
// import db from '../../db/index';
const dbMessager_1 = require("../dbMessager");
class NotebookManager {
    constructor(saveDir) {
        NotebookManager.directoryToSaveNotebooksAt = saveDir;
        // this.saveNotebookLocation(NotebookManager.directoryToSaveNotebooksAt);
        this.createRootDirectory(NotebookManager.directoryToSaveNotebooksAt);
        this.notebooks = [];
        let notebooksList = this.getNotebooks();
        console.log('nlist: ' + notebooksList);
        this.DbConnection = new dbMessager_1.default();
        this.DbConnection.messageDb();
        // // Bootstrap db with notebooks entry
        // this.db.find({ name: 'notebooks' }, function (err: any, docs: any) {
        //     console.log(docs.length);
        // if (docs.length === 0) {
        //     db.insert({ name: 'notebooks', notebooks: notebooksList });
        // }
        // });
        // db.insert({ name: 'notebooks' }, { notebooks: notebooksList });
    }
    /**
     * @returns string - location of save directory
     */
    static getNotebookLocation() {
        return NotebookManager.directoryToSaveNotebooksAt;
        // return store.get(NotebookManager.notebookSaveKey);
    }
    // TODO:
    // After notebook dir is created, add notebook name to DB
    addNotebook(name) {
        if (this.notebookExists(name)) {
            try {
                fs.mkdir(`${NotebookManager.directoryToSaveNotebooksAt}\\${name}`, () => {
                    this.addNotebookToLog(name);
                    console.log('notebook created!');
                    return;
                    // db.update({ name: 'notebooks' }, { $push: { notebooks: name } });
                });
            }
            catch (error) {
                return;
            }
        }
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
