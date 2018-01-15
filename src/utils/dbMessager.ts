import Db from '../db/index';

export class DbMessager {
    
    db: Nedb;
    
    constructor() {
        let setup = new Db();
        this.db = setup.getDb();
    }

    getNotebooks(): any {
        return new Promise((resolve) => {
            this.db.findOne({ name: 'notebooks' }, (err: any, doc: any): any => {
                if (doc) {
                    resolve(doc.notebooks);
                }
                resolve([]);
            });
        });
    }

    createNotebook(name: string): any {
        return new Promise((resolve) => {
            this.db.insert( {notebook: name, notes: [] }, (err: Error) => {
                if (err) {
                    resolve(false);
                }
                resolve(true);
            });
        });
    }

    createNote(notebook: string, note: string): any {
        return new Promise((resolve) => {
            let docToSave = {
                notebookName: notebook,
                noteName: note,
                noteContent: '',
                tags: [],
                documentFor: 'NOTE_DATA'
            };

            this.db.insert(docToSave, (err: Error) => {
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
    saveNoteContent(data: any): any {
        return new Promise((resolve) => {
            
            let notebookName = data.notebook;
            let noteName = data.note;
            let noteContent = data.data;

            let docToSave = {
                notebookName: notebookName,
                noteName: noteName,
                documentFor: 'NOTE_DATA'
            };

            this.db.findOne(docToSave, (err: Error, doc: any) => {
                if (doc) {
                    this.db.update(docToSave, { $set: {noteContent: noteContent} }, {}, () => {
                        resolve(true);
                    });
                } else {
                    this.db.insert(
                    { 
                        notebookName: notebookName, 
                        noteName: noteName, 
                        documentFor: 'NOTE_DATA', 
                        noteContent: noteContent,
                        tags: [] 
                    }, 
                    () => {
                        resolve(true);
                    });
                }

            });
        });
    }

    addTagToNote(data: any) {
        return new Promise((resolve) => {

            let notebook = data.notebook;
            let note = data.note;
            let tag = data.tag;

            this.db.findOne
            (
                {notebookName: notebook, 
                noteName: note, 
                documentFor: 'NOTE_DATA'
            },  (err: Error, doc: any) => {

                if (doc) {
                    this.db.update(doc, { $push: {tags: tag} }, {}, () => {
                        resolve(true);
                    });
                } else {
                    resolve(false);
                }

            });

        });
    }

    getNoteTags(notebook: string, note: string) {
        return new Promise((resolve) => {
            let docToGet = {notebookName: notebook, noteName: note, documentFor: 'NOTE_DATA'};
            this.db.findOne(docToGet, (err: Error, doc: any) => {

                if (doc) {
                    if (doc.tags) {
                        resolve(doc.tags);
                    } else {
                        resolve([]);
                    }
                } else {
                    resolve([]);
                }

            });
        });
    }

    getNoteContent(notebook: string, note: string) {
        return new Promise((resolve) => {
            this.db.findOne(
                {notebookName: notebook, noteName: note, documentFor: 'NOTE_DATA'}, (err: Error, doc: any) => {
                resolve(doc);
            });
        });
    }

    getNotebook(notebook: string): any {
        return new Promise((resolve) => {
            this.db.findOne({ notebook: notebook }, (err: any, doc: any): any => {
                resolve(doc);
            });
        });
    }

    getNotebooksLocation(): any {
        return new Promise(resolve => {
            this.db.findOne({ name: 'notebooksLocation' }, (err: Error, doc: any) => {
                if (doc) {
                    resolve(doc.notebooksLocation);
                }
                resolve('');
            });
        });
    }

    addNotebook(name: string): any {
        return new Promise((resolve) => {
            this.db.update({ name: 'notebooks' }, { $push: { notebooks: name } }, {}, (err: Error) => {
                if (err) {
                    resolve(false);
                }
                resolve(true);
            });
        });
    }

    addExistingNotebooks(notebooks: string[]): any {
        return new Promise((resolve) => {
            this.db.findOne({ name: 'notebooks' }, (err: Error, doc: any) => {
                if (doc) {
                    this.db.update({ name: 'notebooks' }, { notebooks: notebooks }, {}, () => {
                        resolve(true);
                    });
                } else {
                    this.db.insert({ name: 'notebooks', notebooks: notebooks }, () => {
                        resolve(true);
                    });
                }
            });
        });
    }

    setNotebooksLocation(location: string): any {
        return new Promise(resolve => {
            let documentName = 'notebooksLocation';
            this.db.findOne({ name: documentName }, (err: Error, doc: any) => {
                if (doc) {
                    this.db.update( 
                        { name: documentName }, 
                        { $set: { notebooksLocation: location } }, 
                        {}, (error: Error) => {
                        if (error) {
                            resolve(false);
                        }
                        resolve(true);
                    });
                } else {
                    this.db.insert( {name: documentName, notebooksLocation: location }, (error: Error) => {
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
            this.db.findOne({ name: 'applicationSettings' }, (err: Error, doc: any) => {
                if (doc) {
                    resolve(doc);
                } else {
                    this.db.insert({ name: 'applicationSettings' }, (error: Error, document: any) => {
                        if (document) {
                            resolve(document);
                        }
                    });
                }
            });
        });
    }

    getFromSettings(key: string) {
        return new Promise(resolve => {
            this.db.findOne({ name: 'applicationSettings', }, (error: Error, document: any) => {
                if (document) {
                    resolve(document[key]);
                } else {
                    resolve(false);
                }
            });
        });
    }

    updateSettings(key: string, value: any) {
        let newValue = {};
        newValue[key] = value;
        return new Promise(resolve => {
            this.db.update({ name: 'applicationSettings'}, { $set: newValue }, {}, (error: Error) => {
                if (error) {
                    resolve(false);
                } else {
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
    setLastOpenedNote(notebook: string, note: string) {
        return new Promise(resolve => {
            this.db.findOne({ notebook: notebook }, (error: Error, document: any) => {
                if (document) {
                    this.db.update({ notebook: notebook }, { $set: { lastOpenedNote: note } }, {}, (err: Error) => {
                        if (err) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
                } else {
                    this.db.insert({ notebook: notebook, lastOpenedNote: note }, (err: Error) => {
                        if (err) {
                            resolve(false);
                        } else {
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
    getLastOpenedNote(notebook: string) {
        return new Promise(resolve => {
            this.db.findOne({ notebook: notebook }, (error: Error, document: any) => {
                if (document) {
                    resolve(document.lastOpenedNote);
                } else {
                    resolve(null as any);
                }
            });
        });
    }

    messageDb() {
        console.log('LOLOLOLO');
        this.db.find({ name: 'notebooks' }, function (err: any, docs: any) {
            console.log(docs);
        });
    }
}

export default DbMessager;