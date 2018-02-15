"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
require('dotenv').load();
var isDev = require('electron-is-dev');
const notebookManager_1 = require("./utils/notebook-management/notebookManager");
const index_1 = require("./constants/index");
const dbMessager_1 = require("./utils/dbMessager");
var path = require('path');
// let db = new Db().getDb() as Nedb;
let mainWindow;
// let notebookManager: NotebookManager;
let dbMessager = new dbMessager_1.default();
function createWindow() {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            webSecurity: false
        }
    });
    // // and load the index.html of the app.
    // mainWindow.loadURL(url.format({
    //     pathname: path.join(__dirname, '../index.html'),
    //     protocol: 'file:',
    //     slashes: true,
    // }));
    // mainWindow.loadURL('http://localhost:3000');
    // isDev = true;
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    mainWindow.on('close', () => {
        mainWindow.webContents.send(index_1.EXIT_APP_SAVE_CONTENT);
    });
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
electron_1.ipcMain.on(index_1.EDIT_NOTE_CONTENT_CONTEXT_MENU, (event, args) => {
    let contextMenu = new electron_1.Menu();
    contextMenu.append(new electron_1.MenuItem({
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
    }));
    contextMenu.append(new electron_1.MenuItem({
        label: 'Redo',
        accelerator: 'CmdOrCtrl+Y',
        role: 'redo'
    }));
    contextMenu.append(new electron_1.MenuItem({ type: 'separator' }));
    contextMenu.append(new electron_1.MenuItem({
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
    }));
    contextMenu.append(new electron_1.MenuItem({
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
    }));
    contextMenu.append(new electron_1.MenuItem({
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
    }));
    contextMenu.append(new electron_1.MenuItem({
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
    }));
    contextMenu.popup(mainWindow);
});
electron_1.ipcMain.on(index_1.EDIT_NOTE_ITEM_CONTEXT_MENU, (event, data) => {
    let contextMenu = new electron_1.Menu();
    contextMenu.append(new electron_1.MenuItem({
        label: 'Rename',
        click: function () {
            console.log('RENAME THIS NOTE');
            event.sender.send(index_1.RENAME_NOTE, data);
            // Send to renderer process event telling it to open input field
            // Update app state with new props
            // When sidebar component is about to get updated, check if
            // a note rename input should be displayed - display if true
        }
    }));
    contextMenu.popup(mainWindow);
});
electron_1.ipcMain.on(index_1.RENAME_NOTE, (event, data) => {
    let notebook = data.notebook;
    let oldNote = data.oldNote;
    let newNote = data.newNote;
    // TODO:
    // Get notebook name, old note name & new note name - DONE
    // Rename note
    // After renaming note, relink assets for that note
    // Update db entry that has old note name with new note name
    console.log('nbook: ' + notebook);
    console.log('old note name: ' + oldNote);
    console.log('new note name: ' + newNote);
    dbMessager.getFromSettings('notebooksLocation')
        .then((location) => {
        let pathToNotebook = path.join(location, notebook);
        notebookManager_1.default.renameNote(pathToNotebook, oldNote, newNote)
            .then((result) => {
            if (result) {
                // Relink Assets for that Note
                let newNotePath = path.join(location, notebook, newNote, 'index.html');
                let updatedNoteData = notebookManager_1.default.changeAssetLinks(location, notebook, newNotePath);
                if (updatedNoteData) {
                    notebookManager_1.default.updateNoteData(newNotePath, updatedNoteData)
                        .then(() => {
                        // Update DB entry with new note name
                        dbMessager.changeNoteName(notebook, oldNote, newNote);
                    });
                }
            }
        });
    });
});
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
electron_1.ipcMain.on(index_1.GET_NOTEBOOKS_LOCATION, (event, args) => {
    dbMessager.getFromSettings('notebooksLocation')
        .then((location) => {
        console.log(`location: ${location}`);
        if (location) {
            event.sender.send(index_1.LOAD_NOTEBOOKS_LOCATION, location);
        }
        else {
            event.sender.send(index_1.LOAD_NOTEBOOKS_LOCATION, 'NOTEBOOKS_LOCATION_NOT_SET');
        }
    });
});
electron_1.ipcMain.on('get-global-packages', () => {
    console.log('create nbook!');
});
electron_1.ipcMain.on('is-location-for-notebooks-set', (event, args) => {
    event.sender.send('start-it!', notebookManager_1.default.getNotebookLocation());
});
electron_1.ipcMain.on(index_1.CHOOSE_LOCATION_FOR_NOTEBOOKS, (event, args) => {
    let location;
    try {
        location = electron_1.dialog.showOpenDialog({ properties: ['openDirectory'] }).shift();
    }
    catch (error) {
        console.log(`Location not selected: ${error}`);
    }
    if (location) {
        dbMessager.createSettings()
            .then((res) => {
            if (res) {
                notebookManager_1.default.createNotebooksDirectory(location)
                    .then((notebooksLocation) => {
                    // In case that an absolute path to notebook directory has changed but
                    // there is note content inside notebook directory, this will relink
                    // that content to new directory.
                    notebookManager_1.default.relinkAttachmentContent(notebooksLocation)
                        .then(() => {
                        // TODO: Add existing notes to DB
                        let notebooks = notebookManager_1.default.getNotebooks(notebooksLocation);
                        notebookManager_1.default.getAllNotes(notebooksLocation, notebooks)
                            .then((notes) => {
                            console.log('NOTES WE GOT');
                            console.log(notes);
                            // console.log('NOTEBOOKS LOCATION: ' + notebooksLocation);
                            dbMessager.addAllExistingNotes(notes)
                                .then(() => {
                                dbMessager.searchNotesGlobally('')
                                    .then((docs) => {
                                    event.sender.send(index_1.RELOAD_SEARCH_RESULTS, docs);
                                });
                                notebookManager_1.default.createTrashcan(notebooksLocation)
                                    .then(() => {
                                    dbMessager.updateSettings('notebooksLocation', notebooksLocation)
                                        .then((result) => {
                                        if (result) {
                                            event.sender.send('location-for-notebooks', notebooksLocation);
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            }
        });
    }
});
electron_1.ipcMain.on(index_1.ADD_NOTEBOOK, (event, notebookName) => {
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
    // Bootstrap db with notebooks entry
    dbMessager.getFromSettings('notebooksLocation')
        .then((location) => {
        console.log('GET NOTEBOOKS LOCATION: ' + location);
        let notebooks = notebookManager_1.default.getNotebooks(location);
        // dbMessager.updateSettings('notebooks', notebooks)
        dbMessager.addExistingNotebooks(notebooks)
            .then(() => {
            event.sender.send(index_1.GET_NOTEBOOKS, notebooks);
            // ipcMain catches this event as soon as the HomePage component gets 
            // loaded - here we get all notes for our main section on the HomePage
            // component.
            // dbMessager.searchNotesGlobally('')
            // .then((docs: any) => {
            //   event.sender.send(RELOAD_SEARCH_RESULTS, docs);
            // });
        });
    });
});
electron_1.ipcMain.on(index_1.LOAD_SETTINGS, (event) => {
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
        notebookManager_1.default.addNote(path.join(location, notebook), noteName)
            .then((result) => {
            if (result) {
                dbMessager.createNote(notebook, noteName);
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
        notebookManager_1.default.getNotes(path.join(location, notebook))
            .then((notes) => {
            notebookManager_1.default.getNotesCreationDate(notes)
                .then((result) => {
                notes = notebookManager_1.default.orderNotesBy(result, 'created_at');
                notes = notebookManager_1.default.formatNotes(notes);
                event.sender.send(index_1.GET_NOTES, notes);
                // dbMessager.getLastOpenedNote(notebook)
                // .then((note: string) => {
                //   let data = {
                //     notebook: notebook,
                //     noteName: note
                //   };
                //   event.sender.send(UPDATE_NOTE_STATE, data);
                //   if (note) {
                //     let absolutePathToNote = path.join(location, notebook, note + '.html');
                //     NotebookManager.getNoteData(absolutePathToNote)
                //     .then((noteData: string) => {
                //       event.sender.send(LOAD_CONTENT_INTO_NOTE, noteData);
                //     });
                //   }
                // });
            });
        });
    });
});
electron_1.ipcMain.on(index_1.GET_NOTE_CONTENT, (event, data) => {
    let notebook = data.notebook;
    let note = data.note;
    dbMessager.getFromSettings('notebooksLocation')
        .then((location) => {
        let absolutePathToNote = path.join(location, notebook, note, 'index.html');
        notebookManager_1.default.getNoteData(absolutePathToNote)
            .then((noteData) => {
            dbMessager.getNoteTags(data.notebook, data.note)
                .then((tags) => {
                if ('getContentForPreview' in data) {
                    let dataToSend = {
                        notebook: notebook,
                        note: note,
                        noteContent: noteData,
                        tags: tags
                    };
                    event.sender.send(index_1.PREVIEW_NOTE, dataToSend);
                }
                else {
                    event.sender.send(index_1.LOAD_CONTENT_INTO_NOTE, noteData);
                    event.sender.send(index_1.GET_TAGS_FOR_NOTE, tags);
                }
            });
        });
    });
});
electron_1.ipcMain.on(index_1.GET_NAME_OF_LAST_OPENED_NOTE, (event, notebook) => {
    dbMessager.getLastOpenedNote(notebook)
        .then((note) => {
        event.sender.send(index_1.GET_NAME_OF_LAST_OPENED_NOTE, note);
    });
});
electron_1.ipcMain.on(index_1.UPDATE_NOTE_STATE, (event, args) => {
    let noteName = args.noteName;
    let notebook = args.notebookName;
    dbMessager.setLastOpenedNote(notebook, noteName)
        .then((result) => {
        event.sender.send(index_1.UPDATE_NOTE_STATE, args);
    });
});
electron_1.ipcMain.on(index_1.UPDATE_NOTE, (event, data) => {
    // console.log('WRITE NOTE CONTENT TO FILE');
    // console.log(JSON.stringify(data));
    let noteName = data.noteName;
    let notebookName = data.notebookName;
    let noteData = data.noteData;
    let noteDataTextOnly = data.noteDataTextOnly;
    let updatePreviewContent = data.updatePreviewContent;
    if (noteName && notebookName) {
        dbMessager.getFromSettings('notebooksLocation')
            .then((location) => {
            if (location) {
                let absolutePathToNote = path.join(location, notebookName, noteName, 'index.html');
                notebookManager_1.default.updateNoteData(absolutePathToNote, noteData)
                    .then((result) => {
                    if (result) {
                        let noteDataToSave = {
                            note: noteName,
                            notebook: notebookName,
                            data: noteDataTextOnly
                        };
                        dbMessager.saveNoteContent(noteDataToSave)
                            .then(() => {
                            // For cases when user edits note content and immediately goes back
                            // to home page. Update content that just got saved inside the
                            // preview window of home page.
                            if (updatePreviewContent) {
                                dbMessager.getNoteTags(notebookName, noteName)
                                    .then((tags) => {
                                    let dataToSend = {
                                        notebook: notebookName,
                                        note: noteName,
                                        noteContent: noteData,
                                        tags: tags
                                    };
                                    event.sender.send(index_1.PREVIEW_NOTE, dataToSend);
                                });
                            }
                            // After note content successfully saves, fetch all notes for
                            // main section again so the list is current.
                            dbMessager.searchNotesGlobally('')
                                .then((docs) => {
                                event.sender.send(index_1.RELOAD_SEARCH_RESULTS, docs);
                            });
                            dbMessager.getAllTags()
                                .then((tags) => {
                                event.sender.send(index_1.GET_ALL_TAGS, tags);
                            });
                        });
                    }
                });
            }
        });
    }
});
electron_1.ipcMain.on(index_1.GET_ALL_TAGS, (event, args) => {
    dbMessager.getAllTags()
        .then((tags) => {
        event.sender.send(index_1.GET_ALL_TAGS, tags);
    });
});
electron_1.ipcMain.on(index_1.GET_NOTES_WITH_TAGS, (event, tags) => {
    console.log('tags to get: ' + tags);
    dbMessager.searchNotesGlobally('', 10, 0, tags)
        .then((docs) => {
        event.sender.send(index_1.RELOAD_SEARCH_RESULTS, docs);
    });
});
electron_1.ipcMain.on(index_1.DELETE_NOTE, (event, data) => {
    let note = data.noteName;
    let notebook = data.notebookName;
    let noteDataTextOnly = data.noteDataTextOnly;
    dbMessager.getFromSettings('notebooksLocation')
        .then((location) => {
        let noteLocation = path.join(location, notebook, note, 'index.html');
        if (data.updateNoteData) {
            notebookManager_1.default.updateNoteData(noteLocation, data.noteData)
                .then((result) => {
                if (result) {
                    notebookManager_1.default.trashNote(location, notebook, note)
                        .then((res) => {
                        if (res) {
                            notebookManager_1.default
                                .changeAssetLinksForTrashedNote(path.join(location, index_1.TRASHCAN), notebook, note)
                                .then(() => {
                                dbMessager.markNoteAsTrash(notebook, note)
                                    .then(() => {
                                    event.sender.send(index_1.DELETE_NOTE, res);
                                    let notebookLocation = path.join(location, notebook);
                                    notebookManager_1.default.getNotes(notebookLocation)
                                        .then((notes) => {
                                        notebookManager_1.default.getNotesCreationDate(notes)
                                            .then((response) => {
                                            notes = notebookManager_1.default.orderNotesBy(response, 'created_at');
                                            notes = notebookManager_1.default.formatNotes(notes);
                                            let lastCreatedNote = notes.pop();
                                            if (lastCreatedNote) {
                                                dbMessager.setLastOpenedNote(notebook, lastCreatedNote);
                                            }
                                            else {
                                                dbMessager.setLastOpenedNote(notebook, '');
                                            }
                                            let noteDataToSave = {
                                                note: note,
                                                notebook: notebook,
                                                data: noteDataTextOnly
                                            };
                                            dbMessager.saveNoteContent(noteDataToSave);
                                        });
                                    });
                                });
                            });
                        }
                    });
                }
            });
        }
        else {
            notebookManager_1.default.trashNote(location, notebook, note)
                .then((res) => {
                event.sender.send(index_1.DELETE_NOTE, res);
            });
        }
    });
    // TODO: After successful delete
    // If we updated a note & deleted it, that means we also need to updated lastOpenedNote
    // Get a list of all notes in dir
    // Sort them by date created
    // Get last item
});
electron_1.ipcMain.on(index_1.GET_TRASH, (event, args) => {
    dbMessager.getFromSettings('notebooksLocation')
        .then((location) => {
        notebookManager_1.default.getTrash(location)
            .then((data) => {
            event.sender.send(index_1.GET_TRASH, data);
        });
    });
});
electron_1.ipcMain.on(index_1.GET_NOTE_FROM_TRASH, (event, data) => {
    let note = data.note;
    let notebook = data.notebook;
    dbMessager.getFromSettings('notebooksLocation')
        .then((location) => {
        let absolutePathToNote = path.join(location, index_1.TRASHCAN, notebook, note, 'index.html');
        notebookManager_1.default.getNoteData(absolutePathToNote)
            .then((noteData) => {
            let noteInfo = {
                note: note,
                notebook: notebook,
                data: noteData
            };
            event.sender.send(index_1.GET_NOTE_FROM_TRASH, noteInfo);
        });
    });
});
electron_1.ipcMain.on(index_1.RESTORE_NOTE_FROM_TRASH, (event, data) => {
    let note = data.note;
    let notebook = data.notebook;
    console.log(`Restore note: ${note} from notebook: ${notebook}`);
    dbMessager.getFromSettings('notebooksLocation')
        .then((location) => {
        notebookManager_1.default.restoreNoteFromTrash(location, notebook, note)
            .then((result) => {
            if (result) {
                notebookManager_1.default
                    .changeAssetLinksForTrashedNote(location, notebook, note)
                    .then(() => {
                    dbMessager.unmarkNoteAsTrash(notebook, note)
                        .then(() => {
                        event.sender.send(index_1.RESTORE_NOTE_FROM_TRASH, result);
                    });
                });
            }
        });
    });
});
electron_1.ipcMain.on(index_1.ADD_TAG_TO_NOTE, (event, data) => {
    console.log('Add tag to note');
    let notebook = data.notebook;
    let note = data.note;
    let tag = data.tag;
    let noteObj = {
        notebook: notebook,
        note: note,
        tag: tag
    };
    dbMessager.addTagToNote(noteObj)
        .then((response) => {
        if (response) {
            dbMessager.getFromSettings('notebooksLocation')
                .then((location) => {
                notebookManager_1.default.addTagToTagFile(path.join(location, notebook, note), tag);
            });
        }
    });
});
electron_1.ipcMain.on(index_1.REMOVE_TAG_FROM_NOTE, (event, data) => {
    let notebook = data.notebook;
    let note = data.note;
    let tag = data.tag;
    dbMessager.removeTagFromNote(notebook, note, tag)
        .then((response) => {
        if (response) {
            dbMessager.getFromSettings('notebooksLocation')
                .then((location) => {
                notebookManager_1.default.removeTagFromTagFile(path.join(location, notebook, note), tag);
            });
        }
    });
});
electron_1.ipcMain.on(index_1.GET_TAGS_FOR_NOTE, (event, data) => {
    // console.log('GET TAGS FOR NOTE: ' + data.note);
    dbMessager.getNoteTags(data.notebook, data.note)
        .then((tags) => {
        // console.log(tags);
        event.sender.send(index_1.GET_TAGS_FOR_NOTE, tags);
    });
});
electron_1.ipcMain.on(index_1.REMOVE_NOTE_FROM_DRIVE, (event, data) => {
    let notebook = data.notebook;
    let note = data.note;
    // Removes note from drive and if that is successful, it removes note document
    // from the db
    dbMessager.getFromSettings('notebooksLocation')
        .then((location) => {
        notebookManager_1.default.destroyNote(location, notebook, note + '.html')
            .then((response) => {
            if (response) {
                dbMessager.removeNote(notebook, note);
            }
        });
    });
});
electron_1.ipcMain.on(index_1.GLOBAL_SEARCH, (event, searchData) => {
    let searchQuery = searchData.searchQuery;
    let searchPageNumber = searchData.searchPage;
    let searchResultsPerPage = searchData.searchResultsPerPage;
    let returnSearchResultsFrom = (searchPageNumber - 1) * searchResultsPerPage;
    let selectedTags = searchData.selectedTags;
    let appendSearchResults = searchData.appendSearchResults;
    console.log('Search notes globally for: ' + searchQuery);
    dbMessager.searchNotesGlobally(searchQuery, searchResultsPerPage, returnSearchResultsFrom, selectedTags)
        .then((docs) => {
        let data = {
            results: docs,
            query: searchQuery
        };
        if (appendSearchResults) {
            event.sender.send(index_1.APPEND_SEARCH_RESULTS, data);
        }
        else {
            event.sender.send(index_1.SEARCH_RESULTS, data);
        }
    });
});
electron_1.ipcMain.on(index_1.RELOAD_SEARCH_RESULTS, (event, searchData) => {
    dbMessager.searchNotesGlobally('')
        .then((docs) => {
        event.sender.send(index_1.RELOAD_SEARCH_RESULTS, docs);
    });
});
electron_1.ipcMain.on(index_1.SEARCH_WITHIN_NOTEBOOK, (event, searchData) => {
    console.log(`Search notes within: ${searchData.notebook} for term ${searchData.searchQuery}`);
    let notebook = searchData.notebook;
    let searchQuery = searchData.searchQuery;
    let searchPageNumber = searchData.searchPage;
    let searchResultsPerPage = searchData.searchResultsPerPage;
    let returnSearchResultsFrom = (searchPageNumber - 1) * searchResultsPerPage;
    let selectedTags = searchData.selectedTags;
    let appendSearchResults = searchData.appendSearchResults;
    console.log('selectedTags: ' + selectedTags);
    dbMessager
        .searchNotesWithinNotebook(notebook, searchQuery, searchResultsPerPage, returnSearchResultsFrom, selectedTags)
        .then((docs) => {
        let data = {
            results: docs,
            query: searchQuery,
            notebook: notebook
        };
        if (appendSearchResults) {
            event.sender.send(index_1.APPEND_SEARCH_RESULTS, data);
        }
        else {
            event.sender.send(index_1.SEARCH_RESULTS, data);
        }
    });
});
electron_1.ipcMain.on(index_1.UPLOAD_IMAGE, (event, data) => {
    // console.log(data);
    dbMessager.getFromSettings('notebooksLocation')
        .then((location) => {
        let noteLocation = {
            notebooksLocation: location,
            notebook: data.notebook,
            note: data.note
        };
        notebookManager_1.default.saveImage(noteLocation, data.filename, data.data)
            .then((absolutePathToImage) => {
            if (absolutePathToImage) {
                event.sender.send(index_1.IMAGE_UPLOADED, absolutePathToImage);
            }
        });
    });
});
electron_1.ipcMain.on(index_1.UPLOAD_ATTACHMENT, (event, data) => {
    dbMessager.getFromSettings('notebooksLocation')
        .then((location) => {
        let noteLocation = {
            notebooksLocation: location,
            notebook: data.notebook,
            note: data.note
        };
        notebookManager_1.default.saveAttachment(noteLocation, data.filename, data.data)
            .then((absolutePathToAttachment) => {
            if (absolutePathToAttachment) {
                let filename = path.parse(absolutePathToAttachment).name;
                let dataToSend = {
                    absolutePathToAttachment: absolutePathToAttachment,
                    filename: filename
                };
                event.sender.send(index_1.ATTACHMENT_UPLOADED, dataToSend);
            }
        });
    });
});
electron_1.ipcMain.on(index_1.DELETE_ATTACHMENT, (event, filenamePath) => {
    notebookManager_1.default.deleteAttachment(filenamePath);
});
electron_1.ipcMain.on(index_1.OPEN_ATTACHMENT, (event, data) => {
    let filenamePath = data.filenamePath;
    let openExplorer = data.openExplorer;
    if (openExplorer) {
        electron_1.shell.showItemInFolder(filenamePath);
    }
    else {
        electron_1.shell.openItem(filenamePath);
    }
});
electron_1.ipcMain.on(index_1.OPEN_HTTP_LINK, (event, link) => {
    link = link.toLowerCase();
    if (!/^https?:\/\//i.test(link)) {
        link = 'http://' + link;
    }
    electron_1.shell.openExternal(link);
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here. 
