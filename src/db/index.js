"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require('electron');
const path = require('path');
const Datastore = require('nedb');
class Db {
    constructor() {
        let userDataPath = (electron.app || electron.remote.app).getPath('userData');
        let dbName = 'montenote-data';
        this.db = new Datastore({
            filename: path.join(userDataPath, dbName + '.json'),
            autoload: true,
            // Nedb has a bug that updates its updatedAt field with Date.now()
            //  regardless if the user specifies a value of his own. Instead,
            // we implement updatedAt manually. 
            timestampData: false
        });
    }
    getDb() {
        return this.db;
    }
}
exports.Db = Db;
exports.default = Db;
