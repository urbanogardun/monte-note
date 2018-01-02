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

fs.mkdir = mkdir;
fs.existsSync = existsSync;
fs.mkdirSync = mkdirSync;
fs.readdirSync = readdirSync;
fs.statSync = statSync;
fs.isDirectory = isDirectory;
fs.__setNotebookList = __setNotebookList;

module.exports = fs;