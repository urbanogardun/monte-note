import PouchDB from 'pouchdb';

const db = new PouchDB('main', {adapter : 'websql'});

export default db;