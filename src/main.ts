import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import NotebookManager from './utils/notebook-management/notebookManager';
import {
  CHOOSE_LOCATION_FOR_NOTEBOOKS, 
  ADD_NOTEBOOK, 
  GET_NOTEBOOKS, 
  LOAD_SETTINGS, 
  ADD_NOTE, 
  GET_NOTES,
  UPDATE_NOTE_STATE,
  UPDATE_NOTE,
  GET_NAME_OF_LAST_OPENED_NOTE,
  GET_NOTE_CONTENT,
  LOAD_CONTENT_INTO_NOTE,
  DELETE_NOTE,
  GET_TRASH,
  GET_NOTE_FROM_TRASH,
  RESTORE_NOTE_FROM_TRASH,
  EXIT_APP_SAVE_CONTENT,
  ADD_TAG_TO_NOTE,
  GET_TAGS_FOR_NOTE
 } from './constants/index';
import DbMessager from './utils/dbMessager';
var path = require('path');

// let db = new Db().getDb() as Nedb;
let mainWindow: Electron.BrowserWindow;
// let notebookManager: NotebookManager;
let dbMessager = new DbMessager();

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
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

  mainWindow.on('close', () => {
    mainWindow.webContents.send(EXIT_APP_SAVE_CONTENT);
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
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }

});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }

});

ipcMain.on('get-global-packages', () => {
    console.log('create nbook!');
});

ipcMain.on('is-location-for-notebooks-set', (event: any, args: any) => {
  event.sender.send('start-it!', NotebookManager.getNotebookLocation());
});

ipcMain.on(CHOOSE_LOCATION_FOR_NOTEBOOKS, (event: any, args: any) => {
  let location = dialog.showOpenDialog({properties: ['openDirectory']}).shift();

  dbMessager.updateSettings('notebooksLocation', location as string)
  .then((result: boolean) => {
    if (result) {
      event.sender.send('location-for-notebooks', location);
    }
  });

});

ipcMain.on(ADD_NOTEBOOK, (event: any, notebookName: any) => {
  dbMessager.getFromSettings('notebooksLocation')
  .then((location: string) => {
    if (location) {
      NotebookManager.addNotebook(location, notebookName)
      .then((result: boolean) => {
        if (result) {
          dbMessager.addNotebook(notebookName);

          event.sender.send(ADD_NOTEBOOK, notebookName);
        }
      });
    }
  });
});

ipcMain.on(GET_NOTEBOOKS, (event: any, args: any) => {
  // Bootstrap db with notebooks entry
  dbMessager.getFromSettings('notebooksLocation')
  .then((location: string) => {
    let notebooks = NotebookManager.getNotebooks(location);
    // dbMessager.updateSettings('notebooks', notebooks)
    dbMessager.addExistingNotebooks(notebooks)
    .then(() => {
      event.sender.send(GET_NOTEBOOKS, notebooks);
    });
  });
});

ipcMain.on(LOAD_SETTINGS, (event: any) => {

  dbMessager.loadSettings()
  .then((settings: any) => {
    event.sender.send(LOAD_SETTINGS, settings);
  });

});

ipcMain.on(ADD_NOTE, (event: any, args: any) => {
  let noteName = args.noteName;
  let notebook = args.notebookName;

  dbMessager.getFromSettings('notebooksLocation')
  .then((location: string) => {
    NotebookManager.addNote(`${location}\\${notebook}`, noteName)
    .then((result: boolean) => {

      if (result) {
        dbMessager.createNote(notebook, noteName);
        dbMessager.setLastOpenedNote(notebook, noteName)
        .then((res: boolean) => {
          event.sender.send(UPDATE_NOTE_STATE, args);
          event.sender.send(ADD_NOTE, noteName);
        });
      }

    });
  });

});

ipcMain.on(GET_NOTES, (event: any, notebook: string) => {
  dbMessager.getFromSettings('notebooksLocation')
  .then((location: string) => {
    NotebookManager.getNotes(`${location}\\${notebook}`)
    .then((notes: string[]) => {
      NotebookManager.getNotesCreationDate(`${location}\\${notebook}`, notes)
      .then((result: any) => {
        notes = NotebookManager.orderNotesBy(result, 'created_at');
        notes = NotebookManager.formatNotes(notes);
        
        event.sender.send(GET_NOTES, notes);
        
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

ipcMain.on(GET_NOTE_CONTENT, (event: any, data: any) => {
  let notebook = data.notebook;
  let note = data.note;

  dbMessager.getFromSettings('notebooksLocation')
  .then((location: string) => {
    let absolutePathToNote = path.join(location, notebook, note + '.html');
    NotebookManager.getNoteData(absolutePathToNote)
    .then((noteData: string) => {
      event.sender.send(LOAD_CONTENT_INTO_NOTE, noteData);
    });
  });

});

ipcMain.on(GET_NAME_OF_LAST_OPENED_NOTE, (event: any, notebook: any) => {
  dbMessager.getLastOpenedNote(notebook)
  .then((note: string) => {
    event.sender.send(GET_NAME_OF_LAST_OPENED_NOTE, note);
  });
});

ipcMain.on(UPDATE_NOTE_STATE, (event: any, args: any) => {
  let noteName = args.noteName;
  let notebook = args.notebookName;

  dbMessager.setLastOpenedNote(notebook, noteName)
  .then((result: boolean) => {
    event.sender.send(UPDATE_NOTE_STATE, args);
  });
});

ipcMain.on(UPDATE_NOTE, (event: any, data: any) => {
  // console.log('WRITE NOTE CONTENT TO FILE');
  // console.log(JSON.stringify(data));
  let noteName = data.noteName;
  let notebookName = data.notebookName;
  let noteData = data.noteData;
  let noteDataTextOnly = data.noteDataTextOnly;

  dbMessager.getFromSettings('notebooksLocation')
  .then((location: string) => {
    if (location) {

      let absolutePathToNote = path.join(location, notebookName, noteName + '.html');

      NotebookManager.updateNoteData(absolutePathToNote, noteData)
      .then((result: boolean) => {
        if (result) {
          console.log('Note content updated successfully');
          let noteDataToSave = {
            note: noteName,
            notebook: notebookName,
            data: noteDataTextOnly
          };
          dbMessager.saveNoteContent(noteDataToSave);
        }
      });
    
    }
  });

});

ipcMain.on(DELETE_NOTE, (event: any, data: any) => {
  let note = data.noteName;
  let notebook = data.notebookName;

  console.log('DELETE NOTE');
  dbMessager.getFromSettings('notebooksLocation')
  .then((location: string) => {

    let noteLocation = path.join(location, notebook, note + '.html');
    if (data.updateNoteData) {
      NotebookManager.updateNoteData(noteLocation, data.noteData)
      .then((result: boolean) => {
        if (result) {
          NotebookManager.trashNote(location, notebook, note + '.html')
          .then((res: boolean) => {
            event.sender.send(DELETE_NOTE, res);

            let notebookLocation = path.join(location, notebook);
            NotebookManager.getNotes(notebookLocation)
            .then((notes: string[]) => {
              NotebookManager.getNotesCreationDate(notebookLocation, notes)
              .then((response: any) => {
                notes = NotebookManager.orderNotesBy(response, 'created_at');
                notes = NotebookManager.formatNotes(notes) as string[];

                let lastCreatedNote = notes.pop();
                if (lastCreatedNote) {
                  dbMessager.setLastOpenedNote(notebook, lastCreatedNote);
                } else {
                  dbMessager.setLastOpenedNote(notebook, '');
                }

              });
            });

          });
        }
      });
    } else {
      NotebookManager.trashNote(location, notebook, note)
      .then((res: boolean) => {
        event.sender.send(DELETE_NOTE, res);
      });
    }

  });
  // TODO: After successful delete
  // If we updated a note & deleted it, that means we also need to updated lastOpenedNote
  // Get a list of all notes in dir
  // Sort them by date created
  // Get last item
  
});

ipcMain.on(GET_TRASH, (event: any, args: any) => {
  dbMessager.getFromSettings('notebooksLocation')
  .then((location: string) => {
    NotebookManager.getTrash(location)
    .then((data: object) => {
      event.sender.send(GET_TRASH, data);
    });
  });
});

ipcMain.on(GET_NOTE_FROM_TRASH, (event: any, data: any) => {
  let note = data.note;
  let notebook = data.notebook;

  dbMessager.getFromSettings('notebooksLocation')
  .then((location: string) => {
    let absolutePathToNote = path.join(location, '.trashcan', notebook, note + '.html');
    NotebookManager.getNoteData(absolutePathToNote)
    .then((noteData: string) => {
      let noteInfo = {
        note: note,
        notebook: notebook,
        data: noteData
      };
      event.sender.send(GET_NOTE_FROM_TRASH, noteInfo);
    });
  });
});

ipcMain.on(RESTORE_NOTE_FROM_TRASH, (event: any, data: any) => {
  let note = data.note;
  let notebook = data.notebook;

  console.log(`Restore note: ${note} from notebook: ${notebook}`);
  dbMessager.getFromSettings('notebooksLocation')
  .then((location: string) => {
    NotebookManager.restoreNoteFromTrash(location, notebook, note + '.html')
    .then((result: boolean) => {
      event.sender.send(RESTORE_NOTE_FROM_TRASH, result);
    });
  });
});

ipcMain.on(ADD_TAG_TO_NOTE, (event: any, data: any) => {
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
  .then((response: boolean) => {
    if (response) {
      dbMessager.getNoteContent(notebook, note)
      .then((result: any) => {
        console.log(result);
      });
    }
  });

});

ipcMain.on(GET_TAGS_FOR_NOTE, (event: any, data: any) => {
  console.log('GET TAGS FOR NOTE: ' + data.note);

  dbMessager.getNoteTags(data.notebook, data.note)
  .then((tags: string[]) => {
    // console.log(tags);
    event.sender.send(GET_TAGS_FOR_NOTE, tags);
  });

});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.