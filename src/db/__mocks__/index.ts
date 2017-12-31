export class Db {

    static notebookList: string[];
    static dbData: string[];
    static notebooksLocation: string;

    static __setNotebookList(list: string[]) {
        Db.notebookList = list;
    }

    static __setNotebooksLocation(location: string) {
        Db.notebooksLocation = location;
    }

    getDb() {
        return {find: (searchQuery: any) => {
            if (searchQuery.name === 'notebooksLocation') {
                return true;
            } else {
                return Db.notebookList;
            }
        }, update: (searchQuery: any) => {
            return true;
        }};
    }

}

export default Db;