import * as React from 'react';
import TagAdder from '../TagAdder/index';
import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
import { 
    UPDATE_NOTE, 
    GET_NAME_OF_LAST_OPENED_NOTE, 
    GET_NOTE_CONTENT, 
    DELETE_NOTE, 
    UPLOAD_IMAGE } from '../../../constants/index';
import Quill, { DeltaStatic } from 'quill';
import '../../../assets/css/quill.snow.css';
import initializeResponsiveImages from '../../../utils/quill-modules/resizable-images/resizable-images-quill';

Quill.register('modules/resizableImages', (quill: Quill) => {
    initializeResponsiveImages(quill);
});

const striptags = require('../../../utils/striptags');

export interface Props {
    notebookName: string;
    lastOpenedNote: string;
    noteContent: string;
    addTagToNote: Function;
    currentNoteTags: string[];
    notes: string[];
    updateNotes: Function;
    updateLastOpenedNote: Function;
    updateNoteContent: Function;
}

export interface State {
    notebookName: string;
    lastOpenedNote: string | null;
}

export class Editor extends React.Component<Props, State> {

    quill: Quill;
    timeout: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            notebookName: this.props.notebookName,
            lastOpenedNote: null,
        };
        ElectronMessager.sendMessageWithIpcRenderer(GET_NAME_OF_LAST_OPENED_NOTE, this.props.notebookName);
    }

    componentDidMount() {
        // After this component gets initialized for the first time it will
        // receive props whose value will stay the same the next time the
        // component gets mounted - this means if we go to a notebook, the first
        // time content of the last opened note will get loaded, but on the 2nd
        // run it won't. Code below explicitly requests note data for this case.
        let lastOpenedNote = this.props.lastOpenedNote as string;
        if (lastOpenedNote.length) {
            let data = {
                notebook: this.state.notebookName,
                note: lastOpenedNote
            };
            ElectronMessager.sendMessageWithIpcRenderer(GET_NOTE_CONTENT, data);
        }

        this.quill = new Quill('#quill-container', {
            modules: {
                toolbar: {
                    container: '#toolbar',
                    handlers: {
                        'omega': function(value: any) {
                            console.log(value);
                        }
                    }
                },
                // toolbar: [
                // ['bold', 'italic', 'underline'],
                // ['image', 'code-block'],
                // ['trash'],
                // ],
                resizableImages: {}
            },
            placeholder: 'Take notes...',
            theme: 'snow',  // or 'bubble'
            scrollingContainer: 'body'
        });

        let toolbar = this.quill.getModule('toolbar');
        toolbar.addHandler('omega');

        // Adds text on hover & custom icon to button
        // let customButton = document.querySelector('.ql-trash') as Element;
        // customButton.setAttribute('title', 'Restore note');
        // customButton.innerHTML = '<span className="oi oi-trash quill-custom-button"></span>';
        // customButton.addEventListener('click', this.deleteNote.bind(this));

        this.quill.on('text-change', (delta: DeltaStatic, oldContents: DeltaStatic, source: any) => {
            
            let noteName = this.props.lastOpenedNote;
            let notebookName = this.state.notebookName;
            let editor = document.querySelector('.ql-editor') as Element;
            let noteData = editor.innerHTML;
            
            if (source === 'user') {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(updateNote, 60000);
            }

            function updateNote() {
                let data = {
                    noteName: noteName,
                    notebookName: notebookName,
                    noteData: noteData
                };
                ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE, data);
            }
        });

    }

    deleteNote() {
        let editor = document.querySelector('.ql-editor') as Element;
        let noteData = editor.innerHTML;

        let data = {
            noteName: this.props.lastOpenedNote,
            notebookName: this.props.notebookName,
            noteData: noteData,
            noteDataTextOnly: striptags(noteData, [], '\n'),
            updateNoteData: true
        };

        // Removes note from app state & sets last opened note to be the last
        // note from the notes array
        let newNotes = removeNote(this.props.notes as string[], data.noteName);
        let updateNotes = this.props.updateNotes as Function;
        updateNotes(newNotes);

        // Updates app state with lastOpenedNote value - it picks last item
        // from an array, which is the newest created note.
        let updateLastOpenedNote = this.props.updateLastOpenedNote as Function;
        updateLastOpenedNote(newNotes.pop());

        // Updates note content in app state
        let updateNoteContent = this.props.updateNoteContent as Function;
        updateNoteContent(this.props.noteContent);

        // If there are no notes in notebook, clears editor from previous
        // note content
        if (newNotes.length === 0) {
            this.quill.deleteText(0, this.quill.getLength());
        }

        ElectronMessager.sendMessageWithIpcRenderer(DELETE_NOTE, data);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.notes.length) {
            this.quill.enable();
            this.quill.focus();
        } else {
            this.quill.disable();
        }

        if ( (this.state.lastOpenedNote === null) || (this.state.lastOpenedNote !== nextProps.lastOpenedNote) ) {
            this.setState({lastOpenedNote: nextProps.lastOpenedNote as string});

            let data = {
                notebook: this.state.notebookName,
                note: nextProps.lastOpenedNote
            };
            ElectronMessager.sendMessageWithIpcRenderer(GET_NOTE_CONTENT, data);
        }

    }

    componentWillUpdate(nextProps: Props) {
        // Load saved content from note file into Quill editor
        this.quill.deleteText(0, this.quill.getLength());
        this.quill.clipboard.dangerouslyPasteHTML(0, nextProps.noteContent as string, 'api');
        // Sets cursor to the end of note content
        this.quill.setSelection(this.quill.getLength(), this.quill.getLength());
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
        
        // let customButton = document.querySelector('.ql-trash') as Element;
        // customButton.removeEventListener('click', this.deleteNote);
    }

    // Sends image data to ipcMain process
    handleImageUpload() {
        let input = document.querySelector('input[type=file]') as any;
        var file    = input.files[0];
        var reader  = new FileReader();

        reader.addEventListener('load', function () {
            ElectronMessager.sendMessageWithIpcRenderer(UPLOAD_IMAGE, reader.result);
        },                      false);

        if (file) {
            reader.readAsDataURL(file);
        }

    }

    render() {
        return (
            <div className="col-sm trashcan main-content notebook-note-editor">
                <TagAdder
                    notebookName={this.state.notebookName}
                    lastOpenedNote={this.props.lastOpenedNote}
                    addTagToNote={this.props.addTagToNote}
                    currentNoteTags={this.props.currentNoteTags}
                    updateNoteContent={this.props.updateNoteContent}
                    noteContent={this.props.noteContent}
                />
                <div id="toolbar">
                    <select className="ql-size">
                        <option value="small"/>
                        <option value="large"/>
                        <option value="huge"/>
                    </select>
                    <button className="ql-bold"/>
                    <button className="ql-italic"/>
                    <button className="ql-underline"/>

                    <input 
                        className="ql-omega" 
                        value="" 
                        type="file" 
                        onChange={() => this.handleImageUpload()}
                    />
                </div>
                <div id="quill-container" />
            </div>
        );
    }
}

export default Editor;

// Helpers
function removeNote(notesList: string[], noteName: string): string[] {
    return notesList.filter((note: string) => { return note !== noteName ? true : false; } );
}