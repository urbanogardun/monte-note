export class NotebookManager {

    static noteExists(location: string) {
        return new Promise(resolve => {
            resolve(true);
        });
    }

    static formatNoteName(location: string) {
        return location;
    }

    static getOnlyTextFromNote(noteLocation: string) {
        return new Promise(resolve => {
            resolve('Text inside note.');
        });
    }

    static getTagsFromTagFile(noteLocation: string) {
        return new Promise(resolve => {
            resolve(['tag-1', 'tag-2', 'tag-3']);
        });
    }

    constructor() {
        return {addNotebook: ''};
    }

}

export default NotebookManager;