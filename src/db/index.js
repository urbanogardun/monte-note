"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pouchdb_1 = require("pouchdb");
const db = new pouchdb_1.default('main', { adapter: 'websql' });
exports.default = db;
