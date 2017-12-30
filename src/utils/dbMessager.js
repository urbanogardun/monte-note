"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../db/index");
class DbMessager {
    constructor() {
        let setup = new index_1.default();
        this.db = setup.getDb();
    }
    messageDb() {
        this.db.find({}, (err, docs) => {
            console.log('DOCS');
            console.log(docs);
        });
    }
}
exports.DbMessager = DbMessager;
exports.default = DbMessager;
