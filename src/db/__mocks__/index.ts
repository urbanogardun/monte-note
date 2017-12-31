export class Db {

    static notebookList: string[];

    static __setNotebookList(list: string[]) {
        Db.notebookList = list;
    }

    getDb() {
        return {find: () => {
            return Db.notebookList;
        }};
    }

}

export default Db;