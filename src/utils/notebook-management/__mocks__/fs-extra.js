const fs = jest.genMockFromModule('fs-extra');

// Mocks file list
let notebookList = [];
function __setNotebookList(list) {
    notebookList = list;
}

function mkdir(path, callback) {
    callback();
}

function existsSync(path) {
    return false;
}

function mkdirSync(dir) {
    return true;
}

function readdirSync(arg) {
    return notebookList;
}

function statSync() {
    return fs;
}

function isDirectory(obj) {
    return true;
}

function callbackFunc() {
    return ['blam', 'lamma'];
}

function writeFile(file, data, callback) {
    callback('');
}

function readdir(path, callback) {
    callback('', 
    ['note-file-1.html', 'note-file-2', 'note-file-3.html', 'note-file-4']
    );
}

function stat(path, callback) {
    // Use setTimeout to simulate async function
    setTimeout(() => {
        callback('', {ctime: 1318289051000.1});
    }, 100);
}

function readFile(location, encoding, callback) {
    callback('', 'test-data');
}

function move(oldPath, newPath) {
    return new Promise(resolve => {
        resolve(true);
    });
}

fs.mkdir = mkdir;
fs.existsSync = existsSync;
fs.mkdirSync = mkdirSync;
fs.readdirSync = readdirSync;
fs.statSync = statSync;
fs.isDirectory = isDirectory;
fs.writeFile = writeFile;
fs.readdir = readdir;
fs.stat = stat;
fs.readFile = readFile;
fs.__setNotebookList = __setNotebookList;
fs.move = move;

module.exports = fs;