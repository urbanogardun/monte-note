const fs = require('fs-extra');
const path = require('path');
const uuidv1 = require('uuid/v1');
import DbMessager from '../dbMessager';

export class NotebookManager {

    // Key that holds location value to notebook directory
    static notebookSaveKey: string = 'notebook-save-directory';
    static directoryToSaveNotebooksAt: string;
    notebooks: string[];
    DbConnection: DbMessager;

    /**
     * @returns string - location of save directory
     */
    static getNotebookLocation(): string {
        return NotebookManager.directoryToSaveNotebooksAt;
        // return store.get(NotebookManager.notebookSaveKey);
    }

    static getNotebooks(directory: string) {
        return fs.readdirSync(directory).filter(function(file: string) {
            return fs.statSync(directory + '/' + file).isDirectory();
        });
    }

    static addNotebook(location: string, name: string) {
        return new Promise(resolve => {
            try {
                fs.mkdir(`${location}\\${name}`, () => {
                    resolve(true);
                });
            } catch (error) {
                return resolve(false);
            }
        });
    }

    static addNote(location: string, name: string) {
        return new Promise(resolve => {
            try {
                Promise.all([
                    this.createNoteFile(location, name),
                    this.createNoteAssetsDirectory(location, name)
                ])
                .then(() => {
                    resolve(true);
                })
                .catch(() => {
                    resolve(false);
                });
            } catch (error) {
                return resolve(false);
            }
        });
    }

    // Creates file inside which note content will get saved
    static createNoteFile(location: string, name: string) {
        return new Promise((resolve) => {
            fs.ensureFile(`${location}/${name}/index.html`)
            .then(() => {
                resolve(true);
            })
            .catch(() => {
                resolve(false);
            });
        });
    }

    // Creates an assets directory where all media content is going to get
    // saved
    static createNoteAssetsDirectory(location: string, name: string) {
        return new Promise((resolve) => {
            fs.ensureDir(`${location}/${name}/assets/images`)
            .then(() => {
                fs.ensureDir(`${location}/${name}/assets/attachments`)
                .then(() => {
                    resolve(true);
                })
                .catch(() => {
                    resolve(false);
                });
            })
            .catch(() => {
                resolve(false);
            });
        });
    }

    static getNotes(location: string) {
        return new Promise(resolve => {
            fs.readdir(`${location}`, (err: Error, files: string[]) => {
                files = files.filter((file: string) => { return file.endsWith('.html'); });
                resolve(files);
            });
        });
    }

    /**
     * Gets date when note file got created
     * @param  {string} location
     * @param  {string[]} notes
     * @returns {noteName: {created_at: date}}
     */
    static getNotesCreationDate(location: string, notes: string[]) {
        return new Promise(resolve => {
            let data = {};
            let itemsProcessed = 0;

            if (notes.length === 0) {
                resolve([]);
            }

            // Sets each file to have an absolute path before getting stats
            notes.map((file: string) => { return path.join(location, file); })
            .forEach((note: string, index: number) => {
                fs.stat(note, (err: Error, stats: any) => {
                    itemsProcessed++;
                    data[notes[index]] = {created_at: stats.birthtime};
                    
                    if (itemsProcessed === notes.length) {
                        resolve(data);
                    }
                });
            });
        });
    }

    /**
     * Orders notes by a property key in ascending order
     * @param  {any} notes - format should be { noteName: {property1: value}}
     * @param  {string} orderBy
     * @returns string[]
     */
    static orderNotesBy(notes: any, orderBy: string): string[] {
        let sortable = [];
        for (const note in notes) {
            if (notes.hasOwnProperty(note)) {
                sortable.push([note, notes[note].created_at]);
            }
        }

        sortable.sort((a: any[], b: any[]) => {
            return (new Date(a[1]) as any) - (new Date(b[1]) as any);
        });

        notes = sortable.map((note: any) => { return note[0]; });
        
        return notes;
    }
    
    /**
     * Formats note name by removing file extension: .html in this case
     * @param  {string} note
     * @returns {string}
     */
    static formatNoteName(note: string): string {
        note = note.slice(0, note.length - 5);
        return note;
    }

    static formatNotes(notes: string[]): string[] {
        let formattedNotes: string[] = [];
        notes.forEach((note: string) => {
            note = NotebookManager.formatNoteName(note);
            formattedNotes.push(note);
        });
        return formattedNotes;
    }

    static updateNoteData(noteLocation: string, noteData: any) {
        return new Promise(resolve => {
            fs.writeFile(noteLocation, noteData, (err: Error) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static getNoteData(noteLocation: string) {
        return new Promise(resolve => {
            fs.readFile(noteLocation, 'utf8', (err: Error, data: any) => {
                resolve(data);
            });
        });
    }

    // Creates .trashcan dir if it does not exist already
    static createTrashcan(notebooksLocation: string) {
        return new Promise(resolve => {
            let dir = path.join(notebooksLocation, '.trashcan');

            fs.ensureDir(dir)
            .then(() => {
                resolve(true);
            })
            .catch((err: Error) => {
                resolve(false);
            });
        });

    }
    
    /**
     * Moves note to trashcan directory
     * @param  {string} notebooksLocation
     * @param  {string} notebookName
     * @param  {string} noteName
     */
    static trashNote(notebooksLocation: string, notebookName: string, noteName: string) {
        let oldPath = path.join(notebooksLocation, notebookName, noteName);
        let newPath = path.join(notebooksLocation, '.trashcan', notebookName, noteName);
        return new Promise(resolve => {
            fs.move(oldPath, newPath)
            .then(() => {
                resolve(true);
            })
            .catch((err: Error) => {
                resolve(false);
            });
        });
    }

    static restoreNoteFromTrash(notebooksLocation: string, notebookName: string, noteName: string) {
        let oldPath = path.join(notebooksLocation, '.trashcan', notebookName, noteName);
        let newPath = path.join(notebooksLocation, notebookName, noteName);
        return new Promise(resolve => {
            fs.move(oldPath, newPath)
            .then(() => {
                resolve(true);
            })
            .catch((err: Error) => {
                resolve(false);
            });
        });
    }

    static destroyNote(notebooksLocation: string, notebookName: string, noteName: string) {
        let notePath = path.join(notebooksLocation, '.trashcan', notebookName, noteName);
        return new Promise(resolve => {
            fs.remove(notePath)
            .then(() => {
                resolve(true);
            })
            .catch((err: Error) => {
                resolve(false);
            });
        });
    }

    /**
     * Gets trashed notes mapped to their corresponding notebooks
     * @param  {string} notebooksLocation - location where notebooks get saved
     */
    static getTrash(notebooksLocation: string) {
        return new Promise(resolve => {
            let pathToTrash = path.join(notebooksLocation, '.trashcan');
            // Get all notebooks in trashcan
            let notebooks = NotebookManager.getNotebooks(pathToTrash);

            // Collect trashed notes for each notebook in trashcan
            let promisesToResolve: any = [];

            for (let i = 0; i < notebooks.length; i++) {
                const notebook = path.join(pathToTrash, notebooks[i]);
                promisesToResolve.push(NotebookManager.getNotes(notebook));
            }

            // Map trashed notes to their corresponding notebooks
            let data = {};
            Promise.all(promisesToResolve)
            .then((notes: any) => {

                for (let i = 0; i < notebooks.length; i++) {
                    const notebook = notebooks[i];
                    data[notebook] = NotebookManager.formatNotes(notes[i]);
                }

                resolve(data);
            });

        });
    }

    static saveImage(saveLocation: any, imageFilename: string, imageData: string) {
        return new Promise((resolve) => {
            let notebooksLocation = saveLocation.notebooksLocation;
            let notebook = saveLocation.notebook;
            let note = saveLocation.note;
            let imageName = this.getNewNameForImage(imageFilename);

            let absolutePathToImage = path.join(notebooksLocation, notebook, note, 'assets', 'images', imageName);

            fs.writeFile(absolutePathToImage, imageData, (err: Error) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(absolutePathToImage);
                }
            });
        });
    }

    static getNewNameForImage(imageFilename: string) {
        let extension = path.extname(imageFilename);
        let newFilename = uuidv1(); // ⇨ 'f64f2940-fae4-11e7-8c5f-ef356f279131'
        newFilename = newFilename + extension;
        return newFilename;
    }

    constructor() {
        // NotebookManager.directoryToSaveNotebooksAt = saveDir;
        // this.createRootDirectory(NotebookManager.directoryToSaveNotebooksAt);
        // let notebooksList = this.getNotebooks();
        this.notebooks = [];
        this.DbConnection = new DbMessager();
        // this.DbConnection.setNotebooksLocation(saveDir);
    }

    getNotebooksLocation() {
        return new Promise(resolve => {
            this.DbConnection.getNotebooksLocation()
            .then((location: string) => {
                NotebookManager.directoryToSaveNotebooksAt = location;
                resolve(location);
            });
        });
    }

    loadExistingNotebooksIntoApp() {
        return new Promise(resolve => {
            let notebooks = this.getNotebooks();
            this.DbConnection.addExistingNotebooks(notebooks)
            .then((result: boolean) => {
                resolve(result);
            });
        });
    }

    setNotebooksLocation(location: string) {
        return new Promise(resolve => {
            this.DbConnection.setNotebooksLocation(location)
            .then((result: boolean) => {
                resolve(result);
            });
        });
    }

    // TODO:
    // After notebook dir is created, add notebook name to DB
    addNotebook(name: string): any {
        return new Promise(resolve => {
            if (this.notebookExists(name)) {
                try {
                    fs.mkdir(`${NotebookManager.directoryToSaveNotebooksAt}\\${name}`, () => {
                        this.addNotebookToLog(name);
                        this.DbConnection.addNotebook(name)
                        .then((result: boolean) => {
                            resolve(result);
                        });
                    });
                } catch (error) {
                    return resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    }

    deleteNotebook(name: string) {
        this.deleteDirectory(path.join(NotebookManager.directoryToSaveNotebooksAt, name));
        this.deleteNotebookFromLog(name);
    }

    /** 
     * Deletes all notebooks
     */
    deleteEverything() {
        this.notebooks.map((notebook) => {
            // Delete notebook folder and files in it
            this.deleteNotebook(notebook);
        });
    }

    /** 
     * Gets all notebooks
     */
    getNotebooks() {
        return fs.readdirSync(NotebookManager.directoryToSaveNotebooksAt).filter(function(file: string) {
            return fs.statSync(NotebookManager.directoryToSaveNotebooksAt + '/' + file).isDirectory();
        });
    }

    /**
     * Sets default directory where notebooks will get saved
     * @param  {string} location - directory for notebooks
     */
    // private saveNotebookLocation(location: string) {
    //     store.set(NotebookManager.notebookSaveKey, location);
    // }
    
    /**
     * Checks if notebook is already created
     * @param  {string} name - notebook name
     * @returns boolean
     */
    private notebookExists(name: string): boolean {
        return (!fs.existsSync(`${NotebookManager.directoryToSaveNotebooksAt}\\${name}`));
    }

    /**
     * Keeps track of notebooks that were created during a session
     * @param  {string} name - notebook name
     */
    private addNotebookToLog(name: string) {
        if (this.notebooks.indexOf(name) === -1) {
            this.notebooks.push(name);
        }
    }

    /**
     * Removes notebook from log
     * @param  {string} name - notebook name
     */
    private deleteNotebookFromLog(name: string) {
        this.notebooks = this.notebooks.filter((val) => val !== name);
    }

    /**
     * Deletes a directory and all files in it
     * @param  {string} path - path to directory
     */
    private deleteDirectory(directoryPath: string) {
        if (fs.existsSync(directoryPath)) {
            
            fs.readdirSync(directoryPath).forEach(function(this: NotebookManager, file: string) {
                var curPath = `${directoryPath}/${file}`;
                
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    this.deleteDirectory(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }

            });

            fs.rmdirSync(directoryPath);
        }
    }

    /**
     * Creates root directory inside which notebooks will be created
     * @param  {string} path - directory path
     */
    // private createRootDirectory(directoryPath: string) {
    //     if (!fs.existsSync(directoryPath)) {
    //         fs.mkdirSync(`${NotebookManager.directoryToSaveNotebooksAt}`);
    //     }
    // }

}

export default NotebookManager;