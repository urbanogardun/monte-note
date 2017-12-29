"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Datastore = require('nedb');
const db = new Datastore({ filename: './datafile', autoload: true });
exports.default = db;
