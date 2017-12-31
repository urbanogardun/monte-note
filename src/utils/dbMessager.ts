import Db from '../db/index';

export class DbMessager {
    
    db: Nedb;
    
    constructor() {
        let setup = new Db();
        this.db = setup.getDb();
    }

    getNotebooks(): any {
        return this.db.find({ name: 'notebooks' }, (err: any, docs: any): string[] => {
            if (docs.length) {
                return docs[0].notebooks;
            }
            return [];
        });
    }

    addNotebook(name: string): any {
        return this.db.update({ name: 'notebooks' }, { $push: { notebooks: name } }, {}, (err: Error) => {
            if (err) {
                return false;
            }
            return true;
        });
    }

    setNotebooksLocation(location: string): void {
        let documentName = 'notebooksLocation';
        this.db.find({ name: documentName }, (err: Error, docs: any) => {
            if (docs.length) {
                this.db.update( { name: documentName }, { notebooksLocation: location });
            } else {
                this.db.insert( {name: documentName, notebooksLocation: location });
            }
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