import * as React from 'react';
import Quill from 'quill';
import electronMessager from '../../../utils/electron-messaging/electronMessager';
import { RESTORE_NOTE_FROM_TRASH, REMOVE_NOTE_FROM_DRIVE, GET_NOTE_FROM_TRASH } from '../../../constants/index';
import renameAttachment from '../../../utils/quill-modules/rename-attachment/renameAttachment';

export interface Props {
    noteContent?: string;
    notebook?: string;
    note?: string;
    trash?: any;
    updateTrash?: Function;
    emptyLastOpenedTrash: Function;
}

export interface State { }

Quill.register('modules/attachmentPopoverTrash', (quill: Quill, options: any) => {
    renameAttachment(quill, options);
});

export class TrashcanEditor extends React.Component<Props, State> {

    quill: Quill;

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        this.quill = new Quill('#quill-container', {
            modules: {
                toolbar: [
                    ['omega'],
                    ['delete-note']
                ],
                attachmentPopoverTrash: {
                    noteInTrash: true
                }
            },
            theme: 'snow'  // or 'bubble',
        });
        this.quill.disable();

        let toolbar = this.quill.getModule('toolbar');
        toolbar.addHandler('omega');
        toolbar.addHandler('delete-note');

        // Adds text on hover & custom icon to button
        let customButton = document.querySelector('.ql-omega') as Element;
        customButton.setAttribute('title', 'Restore note');
        customButton.innerHTML = '<span class="oi oi-loop-square quill-custom-button"></span>';

        // Adds text on hover & custom icon to button
        let deleteNoteButton = document.querySelector('.ql-delete-note') as Element;
        deleteNoteButton.setAttribute('title', 'Delete note');
        deleteNoteButton.innerHTML = '<span class="oi oi-x quill-custom-button"></span>';
        // customButton.addEventListener('click', function() {
        //     console.log('Restore note');
        //     // electronMessager.sendMessageWithIpcRenderer(RESTORE_NOTE, data);
        // });
        // customButton.addEventListener('click', this.restoreNote);
        customButton.addEventListener('click', this.restoreNote.bind(this));
        deleteNoteButton.addEventListener('click', this.deleteNote.bind(this));
    }

    componentWillUnmount() {
        let customButton = document.querySelector('.ql-omega') as Element;
        customButton.removeEventListener('click', this.restoreNote);

        let deleteNoteButton = document.querySelector('.ql-delete-note') as Element;
        deleteNoteButton.removeEventListener('click', this.deleteNote);

        this.props.emptyLastOpenedTrash();
    }

    restoreNote() {
        // TODO:
        // Pass to this component notebook name & note names
        // Ping ipcMain with notebook name & note name
        // Restore the note based on that data
        // Update app state (remove note that got restored from trashcan items)
        let data = {
            note: this.props.note,
            notebook: this.props.notebook
        };
        // console.log(this.props);
        // Update trash
        let updateTrash = this.props.updateTrash as Function;
        let newTrash = Object.assign({}, this.props.trash);
        for (const notebook in this.props.trash) {
            if (this.props.trash.hasOwnProperty(notebook)) {
                let notes = this.props.trash[data.notebook as string];
                notes = notes.filter((note: string) => { return note !== this.props.note; });
                this.props.trash[data.notebook as string] = notes;
                newTrash[data.notebook as string] = notes;
                break;
            }
        }
        updateTrash(newTrash);
        this.quill.deleteText(0, this.quill.getLength());
        electronMessager.sendMessageWithIpcRenderer(RESTORE_NOTE_FROM_TRASH, data);

        $('.trashcan-page-editor').css({'visibility': 'hidden'});

        if (moreNotesLeftInNotebook(newTrash, data.notebook as string)) {
            data.note = newTrash[data.notebook as string][0];
            electronMessager.sendMessageWithIpcRenderer(GET_NOTE_FROM_TRASH, data);
            selectNextNote(data.note as string);
        }
    } 

    deleteNote() {
        if (confirm('Are you sure you want to delete this note?')) {
            // Update trash app state
            let updateTrash = this.props.updateTrash as Function;
            let newTrash = Object.assign({}, this.props.trash);
            for (const notebook in this.props.trash) {
                if (this.props.trash.hasOwnProperty(notebook)) {
                    let notes = this.props.trash[notebook];
                    notes = notes.filter((note: string) => { return note !== this.props.note; });
                    this.props.trash[notebook] = notes;
                    newTrash[notebook] = notes;
                    break;
                }
            }
    
            updateTrash(newTrash);
            this.quill.deleteText(0, this.quill.getLength());
    
            // Delete note document from the drive
            // if successful, delete note document from DB
            let data = {
                notebook: this.props.notebook,
                note: this.props.note
            };
            electronMessager.sendMessageWithIpcRenderer(REMOVE_NOTE_FROM_DRIVE, data);

            $('.trashcan-page-editor').css({'visibility': 'hidden'});

            if (moreNotesLeftInNotebook(newTrash, data.notebook as string)) {
                data.note = newTrash[data.notebook as string][0];
                electronMessager.sendMessageWithIpcRenderer(GET_NOTE_FROM_TRASH, data);
                selectNextNote(data.note as string);
            }
        }
    }

    componentWillUpdate(nextProps: Props) {
        // Anytime we switch between notes, load note content inside editor
        this.quill.deleteText(0, this.quill.getLength());
        // Don't load content into editor unless user clicked on a trashed note
        if ( (nextProps.notebook !== '') && (nextProps.note !== '') ) {
            this.quill.clipboard.dangerouslyPasteHTML(0, nextProps.noteContent as string, 'api');
            $('.trashcan-page-editor').css({'visibility': 'visible'});
        }
    }

    render() {
        return (
            <div className="col trashcan main-content trashcan-page-editor">
                <div id="quill-container" />
            </div>
        );
    }
}

export default TrashcanEditor;

// helpers
function selectNextNote(noteName: string) {
    $('ul.notes').children().each(function(this: HTMLElement) {
        if ($(this).text().trim() === noteName) {
            $(this).addClass('notebook-name-sidebar-active');
        }
    });
}

function moreNotesLeftInNotebook(trash: any, notebookName: string) {
    return trash[notebookName].length > 0;
}