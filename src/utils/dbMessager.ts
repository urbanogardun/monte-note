import Db from '../db/index';

export class DbMessager {
    
    db: Nedb;
    
    constructor() {
        let setup = new Db();
        this.db = setup.getDb();
    }

    getNotebooks(): any {
        return this.db.find({ name: 'notebooks' }, (err: any, docs: any): string[] => {
            console.log('DOCS: ' + docs);
            if (docs.length) {
                return docs[0].notebooks;
            }
            return [];
        });
    }

    messageDb() {
        console.log('LOLOLOLO');
        this.db.find({ name: 'notebooks' }, function (err: any, docs: any) {
            console.log(docs);
        });

        // this.db.find({}, (err: any, docs: any) => {
        //     console.log('DOCS');
        //     console.log(docs);
        // });
    }
}

export default DbMessager;