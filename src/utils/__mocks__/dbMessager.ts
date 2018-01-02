export class DbMessager {

    static notebookList: string[];
    static dbData: string[];
    static notebooksLocation: string;

    setNotebooksLocation(location: string) {
        return new Promise(resolve => {
            DbMessager.notebooksLocation = location;
            resolve(true);
        });
    }

    getNotebooksLocation() {
        return new Promise(resolve => {
            resolve(DbMessager.notebooksLocation);
        });
    }
    
    addNotebook() {
        return new Promise(resolve => {
            resolve(true);
        });
    }

    getNotebooks() {
        return DbMessager.notebookList;
    }

    addExistingNotebooks(notebooks: string[]) {
        return new Promise(resolve => {
            DbMessager.notebookList = notebooks;
            resolve(true);
        });
    }
}

export default DbMessager;