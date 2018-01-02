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
                    this.db.update({ name: 'notebooks' }, { $push: { notebooks: name }}, {}, () => {
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
                    this.db.update( { name: documentName }, { notebooksLocation: location }, {}, (error: Error) => {
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

    updateSettings(key: string, value: string) {
        return new Promise(resolve => {
            this.db.update({ name: 'applicationSettings'}, { key: value }, {}, (error: Error) => {
                if (error) {
                    resolve(false);
                } else {
                    resolve(true);
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