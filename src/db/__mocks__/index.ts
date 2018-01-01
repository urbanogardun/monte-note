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

    static __getNotebooksList() {
        return Db.notebookList;
    }

    getDb() {
        return {find: (searchQuery: any, callback: any) => {
            let notebookList = Db.notebookList;
            let err = 'str';
            if (searchQuery.name === 'notebooksLocation') {
                return true;
            } else {
                callback(err, [{notebooks: notebookList}]);
                return;
            }
        }, update: (searchQuery: any, toUpdate: any, options: any, callback) => {
            // console.log(Db.notebookList);
            Db.notebookList = [...Db.notebookList, 'ex-nb-1', 'ex-nb-2', 'ex-nb-3'];
            console.log(Db.notebookList);
            // return Db.notebookList;
            callback('', '');
        }, insert: (query: string) => {
            return true;
        }};
    }

}

export default Db;