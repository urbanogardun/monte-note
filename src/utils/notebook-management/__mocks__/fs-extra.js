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
    ['Chemistry', 'Biology', 'Animals and Food', 'Design']
    );
}

function stat(path, callback) {
    // Use setTimeout to simulate async function
    setTimeout(() => {
        callback('', {ctime: 1318289051000.1, birthtime: 1318289051000.1});
    }, 100);
}

function readFile(location, encoding, callback) {
    callback('', '<p>Test paragraph.</p>');
}

function move(oldPath, newPath) {
    return new Promise(resolve => {
        resolve(true);
    });
}

function remove(path) {
    return new Promise(resolve => {
        resolve(true);
    });
}

function ensureFile(path) {
    return new Promise(resolve => {
        resolve(true);
    });
}

function ensureDir(path) {
    return new Promise(resolve => {
        if (path.includes('my-notebooks')) {
            resolve(path);
        } else {
            resolve(true);
        }
    });
}

function pathExists(path) {
    return new Promise(resolve => {
        if (path === 'C:\\test\\test-notebooks\\Notebook\Note-1\\assets\\attachments\\25426378.mp4') {
            resolve(true);
        }
        resolve(false);
    })
}

function readFileSync(path) {
    return true;
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
fs.remove = remove;
fs.ensureFile = ensureFile;
fs.ensureDir = ensureDir;
fs.pathExists = pathExists;
fs.readFileSync = readFileSync;

module.exports = fs;