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
        }, update: (searchQuery: any, toUpdate: any, options: any, callback: any) => {
            Db.notebookList = [...Db.notebookList, 'ex-nb-1', 'ex-nb-2', 'ex-nb-3'];
            callback('', '');
        }, insert: (query: string, callback: any) => {
            callback('');
        }, findOne: (query: any, callback: any) => {
            if (query.name === 'applicationSettings') {
                callback(null, {notebooksLocation: ''});
            } else if (query.name === 'notebooks') {
                callback(null, {notebooks: ['book-1', 'book-2', 'book-3']});
            } else if ('notebook' in query) {
                callback(null, {lastOpenedNote: 'test-note-23'});
            } else if (query.documentFor === 'NOTE_DATA') {
                callback(null, {noteName: 'test-note'});
            } else {
                callback();
            }
        }};
    }

}

export default Db;