"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs-extra');
const path = require('path');
const uuidv1 = require('uuid/v1');
const striptags = require('../striptags');
const cheerio = require("cheerio");
const dbMessager_1 = require("../dbMessager");
const index_1 = require("../../constants/index");
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
            return fs.statSync(path.join(directory, file)).isDirectory();
        });
    }
    static addNotebook(location, name) {
        return new Promise(resolve => {
            try {
                fs.mkdir(path.join(location, name), () => {
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
            let notebooksDirectory = path.join(location, 'MonteNote Notebooks');
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
                    this.createNoteAssetsDirectory(location, name),
                    NotebookManager.createTagFile(path.join(location, name))
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
    static renameNote(notebookLocation, oldNoteName, newNoteName) {
        return new Promise(resolve => {
            let oldPath = path.join(notebookLocation, oldNoteName);
            let newPath = path.join(notebookLocation, newNoteName);
            fs.move(oldPath, newPath)
                .then(() => {
                resolve(true);
            })
                .catch((err) => {
                resolve(false);
            });
        });
    }
    // Creates file inside which note content will get saved
    static createNoteFile(location, name) {
        return new Promise((resolve) => {
            fs.ensureFile(path.join(location, name, 'index.html'))
                .then(() => {
                resolve(true);
            })
                .catch(() => {
                resolve(false);
            });
        });
    }
    static createTagFile(noteDir) {
        return new Promise(resolve => {
            resolve(true);
            fs.ensureFile(path.join(noteDir, 'tags.dat'))
                .then(() => {
                resolve(true);
            })
                .catch((err) => {
                resolve(err);
            });
        });
    }
    static addTagToTagFile(noteDir, tag) {
        return new Promise(resolve => {
            fs.appendFile(path.join(noteDir, 'tags.dat'), `${tag}\n`, (err) => {
                if (err) {
                    throw `Could not add tag to a tag file: ${err}`;
                }
                resolve(true);
            });
        });
    }
    static getTagsFromTagFile(noteDir) {
        return new Promise(resolve => {
            fs.readFile(path.join(noteDir, 'tags.dat'), 'utf8', (err, tags) => {
                if (err) {
                    throw `Could not read tags from the file: ${err}`;
                }
                let tagsToReturn = tags.split('\n').filter((tag) => { return tag.length > 0; });
                resolve(tagsToReturn);
            });
        });
    }
    static removeTagFromTagFile(noteDir, tag) {
        return new Promise(resolve => {
            NotebookManager.getTagsFromTagFile(noteDir)
                .then((tags) => {
                tags = tags.filter((t) => { return t !== tag; });
                let tagsFormattedForTagFile = tags.join('\n');
                fs.writeFile(path.join(noteDir, 'tags.dat'), tagsFormattedForTagFile, (err) => {
                    if (err) {
                        throw `Could not overwrite tag file contents: ${err}`;
                    }
                    resolve(tags);
                });
            });
        });
    }
    // Creates an assets directory where all media content is going to get
    // saved
    static createNoteAssetsDirectory(location, name) {
        return new Promise((resolve) => {
            fs.ensureDir(path.join(location, name, 'assets', 'images'))
                .then(() => {
                fs.ensureDir(path.join(location, name, 'assets', 'attachments'))
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
            let isTrashcan = path.parse(location).base === index_1.TRASHCAN;
            let noteFilesInTrash = [];
            if (isTrashcan) {
                fs.readdir(location, (err, noteDirs) => {
                    if (noteDirs.length === 0) {
                        resolve([]);
                    }
                    noteDirs.forEach((noteDir, i) => {
                        fs.readdir(path.join(location, noteDir), (error, notes) => {
                            notes = notes
                                .map((note) => { return path.join(location, noteDir, note, 'index.html'); });
                            noteFilesInTrash = [...noteFilesInTrash, ...notes];
                            if (i === noteDirs.length - 1) {
                                resolve(noteFilesInTrash);
                            }
                        });
                    });
                });
            }
            else {
                fs.readdir(location, (err, files) => {
                    files = files.map((file) => { return path.join(location, file, 'index.html'); });
                    resolve(files);
                });
            }
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
    static formatNoteName(noteLocation) {
        return path.basename(path.dirname(noteLocation));
    }
    static getNotebookNameFromTrashDirectory(noteLocation) {
        return path.parse(noteLocation).name;
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
            let dir = path.join(notebooksLocation, index_1.TRASHCAN);
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
        let newPath = path.join(notebooksLocation, index_1.TRASHCAN, notebookName, noteName);
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
        let oldPath = path.join(notebooksLocation, index_1.TRASHCAN, notebookName, noteName);
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
    static destroyNote(pathToNote) {
        return new Promise(resolve => {
            fs.remove(pathToNote)
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
            let pathToTrash = path.join(notebooksLocation, index_1.TRASHCAN);
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
    static noteExists(noteLocation) {
        return new Promise((resolve) => {
            fs.pathExists(noteLocation, (err, exists) => {
                resolve(exists);
            });
        });
    }
    static saveImage(saveLocation, imageFilename, imageData) {
        return new Promise((resolve) => {
            let notebooksLocation = saveLocation.notebooksLocation;
            let notebook = saveLocation.notebook;
            let note = saveLocation.note;
            let imageName = this.getNewNameForUploadedImage(imageFilename);
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
    static getNewNameForUploadedImage(filename) {
        let extension = path.extname(filename);
        let newFilename = uuidv1(); // ⇨ 'f64f2940-fae4-11e7-8c5f-ef356f279131'
        newFilename = newFilename + extension;
        return newFilename;
    }
    static saveAttachment(saveLocation, attachmentFilename, fileData) {
        return new Promise((resolve) => {
            let notebooksLocation = saveLocation.notebooksLocation;
            let notebook = saveLocation.notebook;
            let note = saveLocation.note;
            let absolutePathToAttachment = path.join(notebooksLocation, notebook, note, 'assets', 'attachments', attachmentFilename);
            NotebookManager.getNewNameForAttachment(absolutePathToAttachment)
                .then((pathToAttachment) => {
                fs.writeFile(pathToAttachment, fileData, (err) => {
                    if (err) {
                        throw `Attachment could not be saved: ${err}`;
                    }
                    else {
                        resolve(pathToAttachment);
                    }
                });
            });
        });
    }
    /**
     * Checks if same filename already exists in the directory; if it does, it
     * adds an integer to the end of the filename to make it unique.
     * @param  {string} attachmentPath
     * @param  {number=1} filenumber
     * @returns {string}
     */
    static getNewNameForAttachment(attachmentPath, filenumber = 1) {
        return new Promise((resolve) => {
            fs.pathExists(attachmentPath)
                .then((exists) => {
                if (exists) {
                    let newPathToAttachment = path.parse(attachmentPath);
                    let attachmentFilename = newPathToAttachment.base;
                    let extension = path.parse(attachmentFilename).ext;
                    let newFilename;
                    if (filenumber > 1) {
                        newFilename = path.parse(attachmentFilename).name.slice(0, -1) + filenumber + extension;
                    }
                    else {
                        newFilename = path.parse(attachmentFilename).name + '_' + filenumber + extension;
                    }
                    newPathToAttachment = path.join(newPathToAttachment.dir, newFilename);
                    resolve(NotebookManager.getNewNameForAttachment(newPathToAttachment, filenumber + 1));
                }
                else {
                    resolve(attachmentPath);
                }
            });
        });
    }
    static deleteAttachment(filePath) {
        return new Promise((resolve) => {
            fs.remove(filePath)
                .then(() => {
                resolve(true);
            })
                .catch((err) => {
                throw `Attachment could not be removed: ${err}`;
            });
        });
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
                        if (updatedNoteData) {
                            fs.writeFile(note, updatedNoteData, (err) => {
                                if (err) {
                                    throw `Could not relink image content: ${err}`;
                                }
                                return;
                            });
                        }
                    }
                });
            }
            resolve(true);
        });
    }
    static changeAssetLinks(notebooksLocation, notebook, note) {
        if (NotebookManager.openNoteFile(note)) {
            return NotebookManager.noteDataWithNewLinksToAssets(notebooksLocation, notebook, note);
        }
        else {
            return false;
        }
    }
    static changeAssetLinksForTrashedNote(notebooksLocation, notebook, note) {
        return new Promise((resolve) => {
            let notePath = path.join(notebooksLocation, notebook, note, 'index.html');
            let noteData = NotebookManager.changeAssetLinks(notebooksLocation, notebook, notePath);
            if (noteData) {
                fs.writeFile(notePath, noteData, (err) => {
                    if (err) {
                        throw `Could not relink image content: ${err}`;
                    }
                    resolve(true);
                });
            }
        });
    }
    static openNoteFile(note) {
        try {
            return fs.readFileSync(note);
        }
        catch (error) {
            console.log(`Note file could not be opened: ${error}`);
        }
        return false;
    }
    static noteDataWithNewLinksToAssets(notebooksLocation, notebook, note) {
        let noteContent = fs.readFileSync(note);
        const $ = cheerio.load(noteContent);
        $('.image-upload, .attachment').each((ind, element) => {
            let oldLink = $(element).attr('href') || $(element).attr('src');
            let filename = path.parse(oldLink).base;
            let noteName = NotebookManager.formatNoteName(note);
            let newLink = '';
            if (notebook === index_1.TRASHCAN) {
                notebook = path.join(index_1.TRASHCAN, path.parse(path.resolve(note, '..', '..')).name);
                newLink = path.join(notebooksLocation, notebook, noteName, 'assets');
            }
            else {
                newLink = path.join(notebooksLocation, notebook, noteName, 'assets');
            }
            if ($(element).hasClass('image-upload')) {
                newLink = path.join(newLink, 'images', filename);
                $(element).attr('src', newLink);
            }
            else if ($(element).hasClass('attachment')) {
                newLink = path.join(newLink, 'attachments', filename);
                $(element).attr('href', newLink);
            }
        });
        return $('body').html();
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
                    fs.mkdir(path.join(NotebookManager.directoryToSaveNotebooksAt, name), () => {
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
            return fs.statSync(path.join(NotebookManager.directoryToSaveNotebooksAt, file)).isDirectory();
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
        return (!fs.existsSync(path.join(NotebookManager.directoryToSaveNotebooksAt, name)));
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
                var curPath = path.join(directoryPath, file);
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
