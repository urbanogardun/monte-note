const electron = require('electron');
const path = require('path');
const Datastore = require('nedb');

// const userDataPath = (electron.app || electron.remote.app).getPath('userData');
// const dbName = 'app-data';
// const db = new Datastore({ filename: path.join(userDataPath, dbName + '.json'), autoload: true });

// // Bootstrap db with notebooks entry
// db.find({ notebooks: [] }, (err: any, docs: any) => {
//     console.log(docs.length);
//     if (docs.length === 0) {
//         db.insert({ notebooks: [], name: 'notebooks' });
//     }
// });

// export default db;

export class Db {
    
    db: Nedb;
    
    constructor() {
        let userDataPath = (electron.app || electron.remote.app).getPath('userData');
        let dbName = 'app-data';
        this.db = new Datastore({ filename: path.join(userDataPath, dbName + '.json'), autoload: true });
    }

    getDb(): Nedb {
        return this.db;
    }
}

export default Db;