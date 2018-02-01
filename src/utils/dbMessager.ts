import Db from '../db/index';
import { NotebookManager } from './notebook-management/notebookManager';

export class DbMessager {
    
    db: Nedb;
    
    constructor() {
        let setup = new Db();
        this.db = setup.getDb();
    }

    /**
     * Searches notes and returns paginated results
     * @param  {string} query - Search term
     * @param  {number} resultsLimit - Returns specified number of results
     * @param  {number} resultsToSkip - Skip first n of results before returning
     * the results that we want
     */
    searchNotesGlobally(query: string, resultsLimit: number = 10, resultsToSkip: number = 0, tags: string[] = []) {
        return new Promise((resolve) => {
            
            let regex = new RegExp(query, 'i');

            let searchQuery = this.formatSearchQuery(regex, tags);

            this.db
                .find(searchQuery)
                .skip(resultsToSkip)
                .limit(resultsLimit)
                .sort({noteLastupdatedAt: -1})
                .exec((err: Error, docs: any) => {

                    // If multiple tags are selected, get only docs that have all selected tags
                    if (tags.length > 1) {
                        docs = docs.filter((doc: any) => {
                            if (this.allTagsInNote(tags, doc.tags)) {
                                return doc;
                            }
                        });
                    }
                    resolve(docs);
                });
        });
    }

    allTagsInNote(sourceTags: string[], noteTags: string[]) {
        let result = true;
        for (let i = 0; i < sourceTags.length; i++) {
            const tag = sourceTags[i];
            if (!this.isTagInNote(tag, noteTags)) {
                result = false;
                break;
            }
        }
        return result;
    }

    isTagInNote(tag: string, noteTags: string[]) {
        if (noteTags.indexOf(tag) === -1 ) {
            return false;
        }
        return true;
    }

    /** Formats a search query for fetching notes
     * @param  {RegExp} query
     * @param  {string[]} tags
     * @returns {object} search query
     */
    formatSearchQuery(query: RegExp, tags: string[], searchWithinNotebook: string = '') {
        let searchQuery: any = {};

        searchQuery.noteContent = query;
        searchQuery.noteInTrash = false;
        
        if (tags.length) {
            searchQuery.noteContent = query;
            searchQuery.tags = { $in: tags };
        }

        if (searchWithinNotebook) {
            searchQuery.notebookName = searchWithinNotebook;
        }

        return searchQuery;
    }

    searchNotesWithinNotebook(
        notebook: string, query: string, resultsLimit: number = 10, resultsToSkip: number = 0, tags: string[] = []) {
        return new Promise((resolve) => {
            
            let regex = new RegExp(query, 'i');

            let searchQuery = this.formatSearchQuery(regex, tags, notebook);

            this.db
            .find(searchQuery)
            .skip(resultsToSkip)
            .limit(resultsLimit)
            .sort({noteLastupdatedAt: -1}).exec((err: Error, docs: any) => {
                
                // If multiple tags are selected, get only docs that have all selected tags
                if (tags.length > 1) {
                    docs = docs.filter((doc: any) => {
                        if (this.allTagsInNote(tags, doc.tags)) {
                            return doc;
                        }
                    });
                }
                resolve(docs);
            });
        });
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

    markNoteAsTrash(notebook: string, note: string): any {
        return new Promise((resolve) => {
            this.db.update
            (
                {notebookName: notebook, noteName: note, documentFor: 'NOTE_DATA'}, 
                { $set: {noteInTrash: true} }, {}, () => {
                resolve(true);
            });
        });
    }

    unmarkNoteAsTrash(notebook: string, note: string): any {
        return new Promise((resolve) => {
            this.db.update
            (
                {notebookName: notebook, noteName: note, documentFor: 'NOTE_DATA'}, 
                { $set: {noteInTrash: false} }, {}, () => {
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
                documentFor: 'NOTE_DATA',
                noteInTrash: false
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
     * Opens note file and gets its text content (among other things) and formats
     * it for saving that data to database
     * @param  {string} notebook
     * @param  {string} noteLocation
     */
    prepareNoteForDb(notebook: string, noteLocation: string) {
        return new Promise(resolve => {
            let data = {
                notebookName: notebook,
                noteName: NotebookManager.formatNoteName(noteLocation),
                noteContent: '',
                tags: [],
                documentFor: 'NOTE_DATA',
                noteInTrash: false
            };
            
            if (noteLocation.includes('.trashcan')) {
                data.noteInTrash = true;
            }

            NotebookManager.getOnlyTextFromNote(noteLocation)
            .then((content: string) => {
                data.noteContent = content;
                resolve(data);
            });
        });
    }
    
    /**
     * Adds note file that already exists inside notebook directory to the database
     * @param  {string} notebook
     * @param  {string} noteLocation
     */
    addExistingNote(notebook: string, noteLocation: string) {
        return new Promise(resolve => {

            NotebookManager.noteExists(noteLocation)
            .then((response: boolean) => {

                if (response) {
                    this.prepareNoteForDb(notebook, noteLocation)
                    .then((docToSave: any) => {
                        this.db.insert(docToSave, (err: Error) => {
                            if (err) {
                                resolve(false);
                            }
                            resolve(true);
                        });
                    });
                } else {
                    resolve(false);
                }

            });

        });
    }
    
    /**
     * Goes over collection of objects with format { notebook: [path-to-note] },
     * gets data for each note, formats it for the database, and saves it.
     * @param  {any} noteData
     */
    addAllExistingNotes(noteData: any) {
        return new Promise(resolve => {
            
            let promisesToResolve: any = [];

            for (const notebookName in noteData) {
                if (noteData.hasOwnProperty(notebookName)) {
                    const notes = noteData[notebookName];
                    
                    notes.forEach((note: string) => {
                        promisesToResolve.push(this.addExistingNote(notebookName, note));
                    });

                }
            }

            Promise.all(promisesToResolve)
            .then(() => {
                resolve(true);
            });

        });
    }

    removeNote(notebook: string, note: string): any {
        return new Promise((resolve) => {
            let docToRemove = {
                notebookName: notebook,
                noteName: note,
                documentFor: 'NOTE_DATA'
            };

            this.db.remove(docToRemove, {}, (err: Error) => {
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
                    this.db.update
                    (docToSave, { $set: {noteContent: noteContent, noteLastupdatedAt: Date.now() } }, {}, () => {
                        resolve(true);
                    });
                } else {
                    this.db.insert(
                    { 
                        notebookName: notebookName, 
                        noteName: noteName, 
                        documentFor: 'NOTE_DATA', 
                        noteContent: noteContent,
                        tags: [],
                        noteInTrash: false,
                        noteLastupdatedAt: Date.now()
                    }, 
                    () => {
                        resolve(true);
                    });
                }

            });
        });
    }

    getAllTags() {
        return new Promise((resolve) => {
            
            this.db.find({documentFor: 'NOTE_DATA', noteInTrash: false}, { tags: 1 }, (err: Error, docs: any) => {

                let allTags = docs.map((doc: any) => { return doc.tags; });
                var uniqueTags = [].concat.apply([], allTags);
                uniqueTags = uniqueTags.filter((tag: string, i: number) => { return uniqueTags.indexOf(tag) === i; });
                resolve(uniqueTags);

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
                    this.db.update(
                        {notebookName: notebook, noteName: note, documentFor: 'NOTE_DATA'}, 
                        { $addToSet: { tags: tag } }, 
                        {}, (error: Error) => {
                        resolve(true);
                    });
                } else {
                    resolve(false);
                }

            });

        });
    }

    removeTagFromNote(notebook: string, note: string, tag: string) {
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

    getNoteTags(notebook: string, note: string) {
        return new Promise((resolve) => {
            let docToGet = {notebookName: notebook, noteName: note, documentFor: 'NOTE_DATA'};
            this.db.findOne(docToGet, {tags: 1}, (err: Error, doc: any) => {

                if (doc) {
                    resolve(doc.tags);
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
            this.db.findOne({ name: 'applicationSettings'}, (error: Error, document: any) => {

                if (document) {
                    this.db.update({ name: 'applicationSettings'}, { $set: newValue }, {}, (err: Error) => {
                        if (error) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        });
    }

    createSettings() {
        return new Promise(resolve => {

            this.db.findOne({ name: 'applicationSettings'}, (error: Error, document: any) => {

                if (!document) {
                    this.db.insert({ name: 'applicationSettings' }, (err: Error) => {
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