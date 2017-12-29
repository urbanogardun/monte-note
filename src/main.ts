import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import NotebookManager from './utils/notebook-management/notebookManager';
import { CHOOSE_LOCATION_FOR_NOTEBOOKS, ADD_NOTEBOOK, GET_NOTEBOOKS } from './constants/index';
import db from './db/index';

let mainWindow: Electron.BrowserWindow;
let notebookManager: NotebookManager;

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
  let notebooksDirectory = dialog.showOpenDialog({properties: ['openDirectory']}).shift();

  notebookManager = new NotebookManager(notebooksDirectory as string);

  event.sender.send('location-for-notebooks', NotebookManager.getNotebookLocation());
});

ipcMain.on(ADD_NOTEBOOK, (event: any, args: any) => {
  try {
    notebookManager.addNotebook(args);
  } catch (error) {
    // Retrieve notebook directory location from electron-store storage
    notebookManager = new NotebookManager(NotebookManager.getNotebookLocation());
    notebookManager.addNotebook(args);
  }
});

ipcMain.on(GET_NOTEBOOKS, (event: any, args: any) => {
  console.log('GET THE NOTEBOOKS FROM DB.');
  // Bootstrap db with notebooks entry
  db.find({ name: 'notebooks' }, (err: any, docs: any) => {

    try {
      event.sender.send(GET_NOTEBOOKS, docs[0].notebooks);
    } catch (error) {
      event.sender.send(GET_NOTEBOOKS, []);
    }

  });

});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.