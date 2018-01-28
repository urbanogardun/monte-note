"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs-extra');
const path = require('path');
const uuidv1 = require('uuid/v1');
const striptags = require('../striptags');
const cheerio = require("cheerio");
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
    static getNotebooks(directory) {
        return fs.readdirSync(directory).filter(function (file) {
            return fs.statSync(directory + '/' + file).isDirectory();
        });
    }
    static addNotebook(location, name) {
        return new Promise(resolve => {
            try {
                fs.mkdir(`${location}\\${name}`, () => {
                    resolve(true);
                });
            }
            catch (error) {
                return resolve(false);
            }
        });
    }
    /**
     * When user chooses a directory where notebooks will get stored, a subdir
     * is created inside which all note content will be located.
     * @param  {string} location
     * @returns {string}
     */
    static createNotebooksDirectory(location) {
        return new Promise(resolve => {
            let notebooksDirectory = path.join(location, 'NinjaNote Notebooks');
            fs.ensureDir(notebooksDirectory)
                .then(() => {
                resolve(notebooksDirectory);
            })
                .catch((err) => {
                throw `Directory for notebooks could not be created: ${err}`;
            });
        });
    }
    static addNote(location, name) {
        return new Promise(resolve => {
            try {
                Promise.all([
                    this.createNoteFile(location, name),
                    this.createNoteAssetsDirectory(location, name)
                ])
                    .then(() => {
                    resolve(true);
                })
                    .catch(() => {
                    resolve(false);
                });
            }
            catch (error) {
                return resolve(false);
            }
        });
    }
    // Creates file inside which note content will get saved
    static createNoteFile(location, name) {
        return new Promise((resolve) => {
            fs.ensureFile(`${location}/${name}/index.html`)
                .then(() => {
                resolve(true);
            })
                .catch(() => {
                resolve(false);
            });
        });
    }
    // Creates an assets directory where all media content is going to get
    // saved
    static createNoteAssetsDirectory(location, name) {
        return new Promise((resolve) => {
            fs.ensureDir(`${location}/${name}/assets/images`)
                .then(() => {
                fs.ensureDir(`${location}/${name}/assets/attachments`)
                    .then(() => {
                    resolve(true);
                })
                    .catch(() => {
                    resolve(false);
                });
            })
                .catch(() => {
                resolve(false);
            });
        });
    }
    static getNotes(location) {
        return new Promise(resolve => {
            fs.readdir(`${location}`, (err, files) => {
                files = files.map((file) => { return path.join(location, file, 'index.html'); });
                resolve(files);
            });
        });
    }
    /**
     * Gets absolute path to each note file from every notebook. Notes for each
     * notebook are put into separate arrays, each array signifying a notebook.
     * @param  {string} location
     * @param  {string[]} notebooks
     * @returns {object} Each object's key is notebook name and value list of notes
     */
    static getAllNotes(location, notebooks) {
        return new Promise(resolve => {
            let notes = [];
            // Get list of note files for each notebook
            console.log(notebooks);
            for (let index = 0; index < notebooks.length; index++) {
                const notebook = notebooks[index];
                notes.push(NotebookManager.getNotes(path.join(location, notebook)));
            }
            Promise.all(notes).then((files) => {
                let data = {};
                // Map note files to notebooks they belong to
                for (let index = 0; index < files.length; index++) {
                    const noteFiles = files[index];
                    const notebook = notebooks[index];
                    data[notebook] = noteFiles;
                }
                resolve(data);
            });
        });
    }
    /**
     * Gets date when note file got created
     * @param  {string} location
     * @param  {string[]} notes
     * @returns {noteName: {created_at: date}}
     */
    static getNotesCreationDate(notes) {
        return new Promise(resolve => {
            let data = {};
            let itemsProcessed = 0;
            if (notes.length === 0) {
                resolve([]);
            }
            // Sets each file to have an absolute path before getting stats
            notes
                .forEach((note, index) => {
                fs.stat(note, (err, stats) => {
                    itemsProcessed++;
                    data[notes[index]] = { created_at: stats.birthtime };
                    if (itemsProcessed === notes.length) {
                        resolve(data);
                    }
                });
            });
        });
    }
    /**
     * Orders notes by a property key in ascending order
     * @param  {any} notes - format should be { noteName: {property1: value}}
     * @param  {string} orderBy
     * @returns string[]
     */
    static orderNotesBy(notes, orderBy) {
        let sortable = [];
        for (const note in notes) {
            if (notes.hasOwnProperty(note)) {
                sortable.push([note, notes[note].created_at]);
            }
        }
        sortable.sort((a, b) => {
            return new Date(a[1]) - new Date(b[1]);
        });
        notes = sortable.map((note) => { return note[0]; });
        return notes;
    }
    /**
     * Formats note name by removing file extension: .html in this case
     * @param  {string} note
     * @returns {string}
     */
    static formatNoteName(note) {
        return path.basename(path.dirname(note));
    }
    static formatNotes(notes) {
        let formattedNotes = [];
        notes.forEach((note) => {
            note = NotebookManager.formatNoteName(note);
            formattedNotes.push(note);
        });
        return formattedNotes;
    }
    static updateNoteData(noteLocation, noteData) {
        return new Promise(resolve => {
            fs.writeFile(noteLocation, noteData, (err) => {
                if (err) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    static getNoteData(noteLocation) {
        return new Promise(resolve => {
            fs.readFile(noteLocation, 'utf8', (err, data) => {
                resolve(data);
            });
        });
    }
    static getOnlyTextFromNote(noteLocation) {
        return new Promise(resolve => {
            NotebookManager.getNoteData(noteLocation)
                .then((data) => {
                let textData = striptags(data);
                resolve(textData);
            });
        });
    }
    // Creates .trashcan dir if it does not exist already
    static createTrashcan(notebooksLocation) {
        return new Promise(resolve => {
            let dir = path.join(notebooksLocation, '.trashcan');
            fs.ensureDir(dir)
                .then(() => {
                resolve(true);
            })
                .catch((err) => {
                resolve(false);
            });
        });
    }
    /**
     * Moves note to trashcan directory
     * @param  {string} notebooksLocation
     * @param  {string} notebookName
     * @param  {string} noteName
     */
    static trashNote(notebooksLocation, notebookName, noteName) {
        let oldPath = path.join(notebooksLocation, notebookName, noteName);
        let newPath = path.join(notebooksLocation, '.trashcan', notebookName, noteName);
        return new Promise(resolve => {
            fs.move(oldPath, newPath)
                .then(() => {
                resolve(true);
            })
                .catch((err) => {
                resolve(false);
            });
        });
    }
    static restoreNoteFromTrash(notebooksLocation, notebookName, noteName) {
        let oldPath = path.join(notebooksLocation, '.trashcan', notebookName, noteName);
        let newPath = path.join(notebooksLocation, notebookName, noteName);
        return new Promise(resolve => {
            fs.move(oldPath, newPath)
                .then(() => {
                resolve(true);
            })
                .catch((err) => {
                resolve(false);
            });
        });
    }
    static destroyNote(notebooksLocation, notebookName, noteName) {
        let notePath = path.join(notebooksLocation, '.trashcan', notebookName, noteName);
        return new Promise(resolve => {
            fs.remove(notePath)
                .then(() => {
                resolve(true);
            })
                .catch((err) => {
                resolve(false);
            });
        });
    }
    /**
     * Gets trashed notes mapped to their corresponding notebooks
     * @param  {string} notebooksLocation - location where notebooks get saved
     */
    static getTrash(notebooksLocation) {
        return new Promise(resolve => {
            let pathToTrash = path.join(notebooksLocation, '.trashcan');
            // Get all notebooks in trashcan
            let notebooks = NotebookManager.getNotebooks(pathToTrash);
            // Collect trashed notes for each notebook in trashcan
            let promisesToResolve = [];
            for (let i = 0; i < notebooks.length; i++) {
                const notebook = path.join(pathToTrash, notebooks[i]);
                promisesToResolve.push(NotebookManager.getNotes(notebook));
            }
            // Map trashed notes to their corresponding notebooks
            let data = {};
            Promise.all(promisesToResolve)
                .then((notes) => {
                for (let i = 0; i < notebooks.length; i++) {
                    const notebook = notebooks[i];
                    data[notebook] = NotebookManager.formatNotes(notes[i]);
                }
                resolve(data);
            });
        });
    }
    static saveImage(saveLocation, imageFilename, imageData) {
        return new Promise((resolve) => {
            let notebooksLocation = saveLocation.notebooksLocation;
            let notebook = saveLocation.notebook;
            let note = saveLocation.note;
            let imageName = this.getNewNameForImage(imageFilename);
            let absolutePathToImage = path.join(notebooksLocation, notebook, note, 'assets', 'images', imageName);
            fs.writeFile(absolutePathToImage, imageData, (err) => {
                if (err) {
                    throw `Image could not be saved: ${err}`;
                }
                else {
                    resolve(absolutePathToImage);
                }
            });
        });
    }
    static getNewNameForImage(imageFilename) {
        let extension = path.extname(imageFilename);
        let newFilename = uuidv1(); // ⇨ 'f64f2940-fae4-11e7-8c5f-ef356f279131'
        newFilename = newFilename + extension;
        return newFilename;
    }
    /**
     * When existing note content is moved to another directory and that new
     * directory is set as new notebooks location, note assets such as images
     * get its absolute path changed.
     * @param  {string} notebooksLocation
     */
    static relinkAttachmentContent(notebooksLocation) {
        return new Promise((resolve) => {
            let notebooks = NotebookManager.getNotebooks(notebooksLocation);
            for (let index = 0; index < notebooks.length; index++) {
                const notebook = notebooks[index];
                NotebookManager.getNotes(path.join(notebooksLocation, notebook))
                    .then((notes) => {
                    // Open each note file and change each image url to the one
                    // using new notebooks location
                    for (let i = 0; i < notes.length; i++) {
                        const note = notes[i];
                        const updatedNoteData = NotebookManager.changeAssetLinks(notebooksLocation, notebook, note);
                        fs.writeFile(note, updatedNoteData, (err) => {
                            if (err) {
                                throw `Could not relink image content: ${err}`;
                            }
                            return;
                        });
                    }
                });
            }
            resolve(true);
        });
    }
    static changeAssetLinks(notebooksLocation, notebook, note) {
        const $ = cheerio.load(fs.readFileSync(note));
        $('.image-upload, .attachment').each((ind, element) => {
            let oldLink = $(element).attr('src');
            let filename = path.parse(oldLink).base;
            let noteName = NotebookManager.formatNoteName(note);
            if ($(element).hasClass('image-upload')) {
                let newLink = path.join(notebooksLocation, notebook, noteName, 'assets', 'images', filename);
                $(element).attr('src', newLink);
            }
            else if ($(element).hasClass('attachment')) {
                let newLink = path.join(notebooksLocation, notebook, noteName, 'assets', 'attachments', filename);
                $(element).attr('src', newLink);
            }
        });
        return $.html();
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
