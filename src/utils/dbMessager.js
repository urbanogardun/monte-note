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
            this.db.find({ name: 'notebooks' }, (err, docs) => {
                if (docs.length) {
                    this.db.update({ name: 'notebooks' }, { $push: { notebooks: name } }, {}, () => {
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
            this.db.find({ name: documentName }, (err, docs) => {
                if (docs.length) {
                    this.db.update({ name: documentName }, { notebooksLocation: location }, {}, (error) => {
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
    messageDb() {
        console.log('LOLOLOLO');
        this.db.find({ name: 'notebooks' }, function (err, docs) {
            console.log(docs);
        });
    }
}
exports.DbMessager = DbMessager;
exports.default = DbMessager;
