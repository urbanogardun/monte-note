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
        return {find: (searchQuery: any, projection: object = {}, callback: any) => {
            let notebookList = Db.notebookList;
            let err = 'str';
            if (searchQuery.name === 'notebooksLocation') {
                return true;
            } else if (searchQuery.documentFor === 'NOTE_DATA') {
                callback('', [
                    {tags: ['test-tag-1', 'test-tag-2']},
                    {tags: ['test-tag-3', 'test-tag-1']}
                ]);
                return;
            } else {
                console.log(searchQuery);
                callback(err, [{notebooks: notebookList}]);
                return;
            }
        }, update: (searchQuery: any, toUpdate: any, options: any, callback: any) => {
            Db.notebookList = [...Db.notebookList, 'ex-nb-1', 'ex-nb-2', 'ex-nb-3'];
            callback('', '');
        }, insert: (query: string, callback: any) => {
            callback('');
        }, findOne: (query: any, callback1: any, callback2: any) => {
            if (query.name === 'applicationSettings') {
                callback1(null, {notebooksLocation: ''});
            } else if (query.name === 'notebooks') {
                callback1(null, {notebooks: ['book-1', 'book-2', 'book-3']});
            } else if ('notebook' in query) {
                callback1(null, {lastOpenedNote: 'test-note-23'});
            } else if (query.documentFor === 'NOTE_DATA') {
                if (callback2) {
                    callback2(null, {noteName: 'test-note', tags: ['tag-1', 'tag-2', 'tag-3']});
                } else {
                    callback1(null, {noteName: 'test-note', tags: ['tag-1', 'tag-2', 'tag-3']});
                }
            } else {
                callback1();
            }
        }, remove: (query: any, options: any, callback: any) => {
            callback('');
        }};
    }

}

export default Db;