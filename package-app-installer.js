var electronInstaller = require('electron-winstaller');
var path = require('path');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: path.join(__dirname, 'MonteNote-win32-x64'),
    outputDirectory: path.join(__dirname, 'MonteNote-win32-x64-installer64'),
    name: 'MonteNote',
    authors: 'Urbano Gardun',
    description: 'Note taking application with a rich set of editing and management features.',
    setupIcon: path.join(__dirname, 'src', 'assets', 'icons', 'win', 'icon.ico'),
    iconUrl: path.join(__dirname, 'src', 'assets', 'icons', 'win', 'icon.ico'),
    setupExe: 'MonteNote.exe',
    exe: 'MonteNote.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));