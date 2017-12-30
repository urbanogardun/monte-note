import Db from '../db/index';

export class DbMessager {
    
    db: Nedb;
    
    constructor() {
        let setup = new Db();
        this.db = setup.getDb();
    }

    messageDb() {
        this.db.find({}, (err: any, docs: any) => {
            console.log('DOCS');
            console.log(docs);
        });
    }
}

export default DbMessager;