"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../db/index");
class DbMessager {
    constructor() {
        let setup = new index_1.default();
        this.db = setup.getDb();
    }
    getNotebooks() {
        this.db.find({ name: 'notebooks' }, (err, docs) => {
            console.log(docs);
            if (docs.length) {
                return docs[0].notebooks;
            }
            return [];
        });
    }
    messageDb() {
        console.log('LOLOLOLO');
        this.db.find({ name: 'notebooks' }, function (err, docs) {
            console.log(docs);
        });
        // this.db.find({}, (err: any, docs: any) => {
        //     console.log('DOCS');
        //     console.log(docs);
        // });
    }
}
exports.DbMessager = DbMessager;
exports.default = DbMessager;
