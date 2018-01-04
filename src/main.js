"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const notebookManager_1 = require("./utils/notebook-management/notebookManager");
const index_1 = require("./constants/index");
// import Db from './db/index';
const dbMessager_1 = require("./utils/dbMessager");
// let db = new Db().getDb() as Nedb;
let mainWindow;
// let notebookManager: NotebookManager;
let dbMessager = new dbMessager_1.default();
function createWindow() {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        height: 600,
        width: 800,
    });
    // // and load the index.html of the app.
    // mainWindow.loadURL(url.format({
    //     pathname: path.join(__dirname, '../index.html'),
    //     protocol: 'file:',
    //     slashes: true,
    // }));
    mainWindow.loadURL('http://localhost:3000');
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        // mainWindow = null;
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', createWindow);
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
electron_1.ipcMain.on('get-global-packages', () => {
    console.log('create nbook!');
});
electron_1.ipcMain.on('is-location-for-notebooks-set', (event, args) => {
    event.sender.send('start-it!', notebookManager_1.default.getNotebookLocation());
});
electron_1.ipcMain.on(index_1.CHOOSE_LOCATION_FOR_NOTEBOOKS, (event, args) => {
    let location = electron_1.dialog.showOpenDialog({ properties: ['openDirectory'] }).shift();
    // notebookManager = new NotebookManager(notebooksDirectory as string);
    // notebookManager.setNotebooksLocation(location as string)
    // .then((result: boolean) => {
    //   if (result) {
    //     event.sender.send('location-for-notebooks', location);
    //   }
    // });
    console.log('location is: ' + location);
    dbMessager.updateSettings('notebooksLocation', location)
        .then((result) => {
        if (result) {
            event.sender.send('location-for-notebooks', location);
        }
    });
});
electron_1.ipcMain.on(index_1.ADD_NOTEBOOK, (event, notebookName) => {
    console.log('ADD NOTEBOOK: ' + notebookName);
    dbMessager.getFromSettings('notebooksLocation')
        .then((location) => {
        if (location) {
            notebookManager_1.default.addNotebook(location, notebookName)
                .then((result) => {
                if (result) {
                    dbMessager.addNotebook(notebookName);
                    event.sender.send(index_1.ADD_NOTEBOOK, notebookName);
                }
            });
        }
    });
});
electron_1.ipcMain.on(index_1.GET_NOTEBOOKS, (event, args) => {
    console.log('GET THE NOTEBOOKS FROM DB.');
    // Bootstrap db with notebooks entry
    dbMessager.getFromSettings('notebooksLocation')
        .then((location) => {
        let notebooks = notebookManager_1.default.getNotebooks(location);
        // dbMessager.updateSettings('notebooks', notebooks)
        dbMessager.addExistingNotebooks(notebooks)
            .then(() => {
            event.sender.send(index_1.GET_NOTEBOOKS, notebooks);
        });
    });
});
electron_1.ipcMain.on(index_1.LOAD_SETTINGS, (event) => {
    console.log('Query DB to get the application settings.');
    dbMessager.loadSettings()
        .then((settings) => {
        event.sender.send(index_1.LOAD_SETTINGS, settings);
    });
});
electron_1.ipcMain.on(index_1.ADD_NOTE, (event, args) => {
    let noteName = args.noteName;
    let notebook = args.notebookName;
    dbMessager.getFromSettings('notebooksLocation')
        .then((location) => {
        console.log('location is: ' + location);
        notebookManager_1.default.addNote(`${location}\\${notebook}`, noteName)
            .then((result) => {
            if (result) {
                dbMessager.setLastOpenedNote(notebook, noteName)
                    .then((res) => {
                    event.sender.send(index_1.UPDATE_NOTE_STATE, args);
                    event.sender.send(index_1.ADD_NOTE, noteName);
                });
            }
        });
    });
});
electron_1.ipcMain.on(index_1.GET_NOTES, (event, notebook) => {
    dbMessager.getFromSettings('notebooksLocation')
        .then((location) => {
        notebookManager_1.default.getNotes(`${location}\\${notebook}`)
            .then((notes) => {
            notebookManager_1.default.getNotesCreationDate(`${location}\\${notebook}`, notes)
                .then((result) => {
                notes = notebookManager_1.default.orderNotesBy(result, 'created_at');
                notes = notebookManager_1.default.formatNotes(notes);
                event.sender.send(index_1.GET_NOTES, notes);
            });
        });
    });
    // TODO: Implement dbMessager.getLastOpenedNote which will get
    // last opened note and send it when we click on notebook to which
    // we want to go - use this method in this ipcMain event listener
});
electron_1.ipcMain.on(index_1.UPDATE_NOTE_STATE, (event, args) => {
    let noteName = args.noteName;
    let notebook = args.notebookName;
    dbMessager.setLastOpenedNote(notebook, noteName)
        .then((result) => {
        event.sender.send(index_1.UPDATE_NOTE_STATE, args);
    });
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here. 
