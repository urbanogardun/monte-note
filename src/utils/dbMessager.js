"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../db/index");
class DbMessager {
    constructor() {
        let setup = new index_1.default();
        this.db = setup.getDb();
    }
    searchNotesGlobally(query) {
        return new Promise((resolve) => {
            let regex = new RegExp(query, 'i');
            this.db.find({ noteContent: regex }).sort({ updatedAt: -1 }).exec((err, docs) => {
                resolve(docs);
            });
        });
    }
    searchNotesWithinNotebook(notebook, query) {
        return new Promise((resolve) => {
            let regex = new RegExp(query, 'i');
            this.db.find({
                notebookName: notebook,
                noteContent: regex
            }).sort({ updatedAt: -1 }).exec((err, docs) => {
                resolve(docs);
            });
        });
    }
    getNotebooks() {
        return new Promise((resolve) => {
            this.db.findOne({ name: 'notebooks' }, (err, doc) => {
                if (doc) {
                    resolve(doc.notebooks);
                }
                resolve([]);
            });
        });
    }
    createNotebook(name) {
        return new Promise((resolve) => {
            this.db.insert({ notebook: name, notes: [] }, (err) => {
                if (err) {
                    resolve(false);
                }
                resolve(true);
            });
        });
    }
    createNote(notebook, note) {
        return new Promise((resolve) => {
            let docToSave = {
                notebookName: notebook,
                noteName: note,
                noteContent: '',
                tags: [],
                documentFor: 'NOTE_DATA'
            };
            this.db.insert(docToSave, (err) => {
                if (err) {
                    resolve(false);
                }
                resolve(true);
            });
        });
    }
    removeNote(notebook, note) {
        return new Promise((resolve) => {
            let docToRemove = {
                notebookName: notebook,
                noteName: note,
                documentFor: 'NOTE_DATA'
            };
            this.db.remove(docToRemove, {}, (err) => {
                if (err) {
                    resolve(false);
                }
                resolve(true);
            });
        });
    }
    /**
     * Saves/updates note content that is stripped from HTML tags
     * @param  {any} data
     */
    saveNoteContent(data) {
        return new Promise((resolve) => {
            let notebookName = data.notebook;
            let noteName = data.note;
            let noteContent = data.data;
            let docToSave = {
                notebookName: notebookName,
                noteName: noteName,
                documentFor: 'NOTE_DATA'
            };
            this.db.findOne(docToSave, (err, doc) => {
                if (doc) {
                    this.db.update(docToSave, { $set: { noteContent: noteContent } }, {}, () => {
                        resolve(true);
                    });
                }
                else {
                    this.db.insert({
                        notebookName: notebookName,
                        noteName: noteName,
                        documentFor: 'NOTE_DATA',
                        noteContent: noteContent,
                        tags: []
                    }, () => {
                        resolve(true);
                    });
                }
            });
        });
    }
    addTagToNote(data) {
        return new Promise((resolve) => {
            let notebook = data.notebook;
            let note = data.note;
            let tag = data.tag;
            this.db.findOne({ notebookName: notebook,
                noteName: note,
                documentFor: 'NOTE_DATA'
            }, (err, doc) => {
                if (doc) {
                    this.db.update(doc, { $addToSet: { tags: tag } }, {}, () => {
                        resolve(true);
                    });
                }
                else {
                    resolve(false);
                }
            });
        });
    }
    removeTagFromNote(notebook, note, tag) {
        return new Promise((resolve) => {
            let docToUpdate = {
                notebookName: notebook,
                noteName: note,
                documentFor: 'NOTE_DATA'
            };
            this.db.update(docToUpdate, { $pull: { tags: tag } }, {}, function () {
                resolve(true);
            });
        });
    }
    getNoteTags(notebook, note) {
        return new Promise((resolve) => {
            let docToGet = { notebookName: notebook, noteName: note, documentFor: 'NOTE_DATA' };
            this.db.findOne(docToGet, (err, doc) => {
                if (doc) {
                    if (doc.tags) {
                        resolve(doc.tags);
                    }
                    else {
                        resolve([]);
                    }
                }
                else {
                    resolve([]);
                }
            });
        });
    }
    getNoteContent(notebook, note) {
        return new Promise((resolve) => {
            this.db.findOne({ notebookName: notebook, noteName: note, documentFor: 'NOTE_DATA' }, (err, doc) => {
                resolve(doc);
            });
        });
    }
    getNotebook(notebook) {
        return new Promise((resolve) => {
            this.db.findOne({ notebook: notebook }, (err, doc) => {
                resolve(doc);
            });
        });
    }
    getNotebooksLocation() {
        return new Promise(resolve => {
            this.db.findOne({ name: 'notebooksLocation' }, (err, doc) => {
                if (doc) {
                    resolve(doc.notebooksLocation);
                }
                resolve('');
            });
        });
    }
    addNotebook(name) {
        return new Promise((resolve) => {
            this.db.update({ name: 'notebooks' }, { $push: { notebooks: name } }, {}, (err) => {
                if (err) {
                    resolve(false);
                }
                resolve(true);
            });
        });
    }
    addExistingNotebooks(notebooks) {
        return new Promise((resolve) => {
            this.db.findOne({ name: 'notebooks' }, (err, doc) => {
                if (doc) {
                    this.db.update({ name: 'notebooks' }, { notebooks: notebooks }, {}, () => {
                        resolve(true);
                    });
                }
                else {
                    this.db.insert({ name: 'notebooks', notebooks: notebooks }, () => {
                        resolve(true);
                    });
                }
            });
        });
    }
    setNotebooksLocation(location) {
        return new Promise(resolve => {
            let documentName = 'notebooksLocation';
            this.db.findOne({ name: documentName }, (err, doc) => {
                if (doc) {
                    this.db.update({ name: documentName }, { $set: { notebooksLocation: location } }, {}, (error) => {
                        if (error) {
                            resolve(false);
                        }
                        resolve(true);
                    });
                }
                else {
                    this.db.insert({ name: documentName, notebooksLocation: location }, (error) => {
                        if (error) {
                            resolve(false);
                        }
                        resolve(true);
                    });
                }
            });
        });
    }
    loadSettings() {
        return new Promise(resolve => {
            this.db.findOne({ name: 'applicationSettings' }, (err, doc) => {
                if (doc) {
                    resolve(doc);
                }
                else {
                    this.db.insert({ name: 'applicationSettings' }, (error, document) => {
                        if (document) {
                            resolve(document);
                        }
                    });
                }
            });
        });
    }
    getFromSettings(key) {
        return new Promise(resolve => {
            this.db.findOne({ name: 'applicationSettings', }, (error, document) => {
                if (document) {
                    resolve(document[key]);
                }
                else {
                    resolve(false);
                }
            });
        });
    }
    updateSettings(key, value) {
        let newValue = {};
        newValue[key] = value;
        return new Promise(resolve => {
            this.db.update({ name: 'applicationSettings' }, { $set: newValue }, {}, (error) => {
                if (error) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    /**
     * Logs name of the note that was last opened in a notebook
     * @param  {string} notebook
     * @param  {string} note
     * @returns {boolean}
     */
    setLastOpenedNote(notebook, note) {
        return new Promise(resolve => {
            this.db.findOne({ notebook: notebook }, (error, document) => {
                if (document) {
                    this.db.update({ notebook: notebook }, { $set: { lastOpenedNote: note } }, {}, (err) => {
                        if (err) {
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    });
                }
                else {
                    this.db.insert({ notebook: notebook, lastOpenedNote: note }, (err) => {
                        if (err) {
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    });
                }
            });
        });
    }
    /**
     * Returns name of note that was last opened inside a notebook
     * @param  {string} notebook
     * @returns {string}
     */
    getLastOpenedNote(notebook) {
        return new Promise(resolve => {
            this.db.findOne({ notebook: notebook }, (error, document) => {
                if (document) {
                    resolve(document.lastOpenedNote);
                }
                else {
                    resolve(null);
                }
            });
        });
    }
    messageDb() {
        console.log('LOLOLOLO');
        this.db.find({ name: 'notebooks' }, function (err, docs) {
            console.log(docs);
        });
    }
}
exports.DbMessager = DbMessager;
exports.default = DbMessager;
