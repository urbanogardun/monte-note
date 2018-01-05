"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../db/index");
class DbMessager {
    constructor() {
        let setup = new index_1.default();
        this.db = setup.getDb();
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
                    resolve(undefined);
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
