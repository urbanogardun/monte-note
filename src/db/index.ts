const Datastore = require('nedb');

const db = new Datastore({ filename: './datafile', autoload: true});

export default db;