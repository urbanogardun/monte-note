const fs = jest.genMockFromModule('fs');

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

fs.mkdir = mkdir;
fs.existsSync = existsSync;
fs.mkdirSync = mkdirSync;
fs.readdirSync = readdirSync;
fs.statSync = statSync;
fs.isDirectory = isDirectory;
fs.writeFile = writeFile;
fs.readdir = readdir;
fs.__setNotebookList = __setNotebookList;

module.exports = fs;