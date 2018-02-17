var striptags = require('../../utils/striptags');

export function prepareNoteData(props: any, noteData: string) {
    let noteDataToSave = {
        noteName: props.lastOpenedNote,
        notebookName: props.notebookName,
        noteData: noteData,
        noteDataTextOnly: striptags(noteData, [], '\n')
    };
    return noteDataToSave;
}

// Sort the note content string and compare the results with old note content
// to check if a note got updated and if it did, to save it.
export function noteContentChanged(oldContent: string, newContent: string) {
    oldContent = oldContent.split('').sort((a: string, b: string) => {
        return a.localeCompare(b);
    }).join();
    newContent = newContent.split('').sort((a: string, b: string) => {
        return a.localeCompare(b);
    }).join();

    return oldContent !== newContent ? true : false;
}