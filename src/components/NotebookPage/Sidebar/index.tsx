import * as React from 'react';
import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
// import { ADD_NOTE, UPDATE_NOTE_STATE, GET_NOTES, UPDATE_NOTE, DELETE_NOTE } from '../../../constants/index';
import { ADD_NOTE, UPDATE_NOTE_STATE, GET_NOTES, UPDATE_NOTE } from '../../../constants/index';
import { Link } from 'react-router-dom';
import * as $ from 'jquery';
var striptags = require('../../../utils/striptags');

export interface Props {
    location?: any;
    notebookName: string;
    notes: string[];
    noteContent: string;
    lastOpenedNote: string;
    updateNotes: Function;
    updateLastOpenedNote: Function;
    updateNoteContent: Function;
}

export interface State {
    showInput: string;
    inputValue: string;
    lastOpenedNote: string;
    noteContent: string;
    notes: string[];
}

export class Sidebar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showInput: 'hidden',
            inputValue: '',
            lastOpenedNote: '',
            noteContent: '',
            notes: []
        };
        ElectronMessager.sendMessageWithIpcRenderer(GET_NOTES, this.props.notebookName);
    }

    showInput() {
        let showInput = this.state.showInput === 'visible' ? 'hidden' : 'visible';
        this.setState({showInput: showInput});

        let editor = document.querySelector('.ql-editor') as Element;
        let noteContentToUpdate = editor.innerHTML;

        // Save note data only if there are notes in notebook
        if (this.props.notes.length) {

            let noteDataToSave = prepareNoteData(this.props, noteContentToUpdate);
    
            // Updates note data only if the data got changed
            if (noteDataToSave.noteData !== this.props.noteContent) {
                ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE, noteDataToSave);
            }

        }

        $('li.open-input').hide();
    }

    // Creates notebook on Enter key press
    handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            let note = this.prepareNote(this.state.inputValue as string);
            this.addNote(note);
            this.resetComponentState();
        }
    }

    // Creates notebook when input field loses focus
    handleFocusOut() {
        let note = this.prepareNote(this.state.inputValue as string);
        this.addNote(note);
        this.resetComponentState();

        $('li.open-input').show();
    }

    // After notebook name gets submitted through the input field, resets the
    // component state to default
    resetComponentState() {
        this.setState({
            showInput: 'hidden',
            inputValue: '',
        });
    }

    updateInputValue(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({inputValue: e.target.value});
    }

    prepareNote(name: string) {
        return name.trim();
    }

    addNote(name: string) {
        if ( (name) && (this.props.notes.indexOf(name) === -1) ) {
            this.setState(
                {lastOpenedNote: name,
                noteContent: '',
                notes: this.props.notes}
            );
            let data = {notebookName: this.props.notebookName, noteName: name};
            ElectronMessager.sendMessageWithIpcRenderer(ADD_NOTE, data);
            ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE_STATE, data);
        }
    }

    // Switches to selected note and loads its content. Saves content of
    // the note we are switching from as well (if needed).
    updateLastOpenedNote(name: string) {
        let editor = document.querySelector('.ql-editor') as Element;
        let noteContentToUpdate = editor.innerHTML;

        let noteDataToSave = prepareNoteData(this.props, noteContentToUpdate);

        let noteToSwitchTo = {
            notebookName: this.props.notebookName, 
            noteName: name
        };

        // Updates note data only if the data got changed
        if (noteDataToSave.noteData !== this.props.noteContent) {
            ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE, noteDataToSave);
        }

        // Switch to another note and get that note's content
        ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE_STATE, noteToSwitchTo);
    }

    componentWillUnmount() {
        // When resizing images, on images that have been hovered over, regardless
        // if they have been resized, a css style class for displaying/hiding 
        // a resize frame will be added. In cases when nothing inside a note
        // doesn't change, note will get updated as latest modified inside the
        // db regardless. This check will remove that resize frame style.
        if ($('.ql-editor').find('img').attr('style') === 'border: none; cursor: inherit;') {
            $('.ql-editor').find('img').removeAttr('style');
        }

        let editor = $('.ql-editor')[0];
        let noteContentToUpdate = editor.innerHTML;
        let noteData = prepareNoteData(this.props, noteContentToUpdate);
        let noteDataToSave = {...noteData, updatePreviewContent: true};

        // Updates note data only if the data got changed
        if (noteDataToSave.noteData !== this.props.noteContent) {
            ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE, noteDataToSave);
        }
    }

    render() {
        let expandNotebooksNoteList = this.props.notes.length > 0 ? 'true' : 'false';
        let showNotesOrNot = this.props.notes.length > 0 ? 'show' : '';
        return (
            <div className="col-2 trashcan sidebar">
                <section className="notebooks">
                    <ul className="list-group notes">
                        <Link 
                            to={'/'} 
                        >
                            <li 
                                className="list-group-item sidebar-note sidebar-link"
                            >Home <span className="oi oi-home trashcan" />
                            </li>
                        </Link>
                    </ul>
                </section>

                <section className="trashcan">
                    <ul className="list-group notes">
                        <li
                            className="list-group-item open-input sidebar-note sidebar-link"
                            onClick={() => this.showInput()}
                        >
                            New Note
                            <span className="oi oi-document document-icon home-icon" />
                        </li>
                    </ul>

                    <div className={`sidebar-app-form input-group input-group-sm ${this.state.showInput}`}>
                        <input
                            value={this.state.inputValue}
                            onChange={e => this.updateInputValue(e)}
                            pattern="^[a-zA-Z0-9]+$"
                            ref={input => input && input.focus()}
                            onKeyPress={(e) => this.handleKeyPress(e)}
                            onBlur={() => this.handleFocusOut()}
                            type="text"
                            className="form-control add-note sidebar-app-form"
                            aria-label="Note"
                            aria-describedby="sizing-addon2"
                        />
                    </div>
                </section>

                <section className="trashcan">
                    <div 
                        title={this.props.notebookName}
                        className="notebook-name-sidebar" 
                        data-toggle="collapse" 
                        data-target="#collapseExample" 
                        aria-expanded={expandNotebooksNoteList}
                    >
                        {
                            this.props.notebookName.length > 25 ? 
                            this.props.notebookName.slice(0, 23) + '...' : 
                            this.props.notebookName
                        }
                        <span className="oi oi-chevron-bottom expand-notebook" />
                        <span className="oi oi-chevron-left expand-notebook" />
                    </div>
                    <div className={`collapse notes-sidebar ${showNotesOrNot}`} id="collapseExample">
                        <ul className="list-group notes">
                            {(this.props.notes as string[]).map((name: string, index: number) => {
                                let activeNote = 
                                name === this.props.lastOpenedNote ? 'notebook-name-sidebar-active' : '';
                                return (
                                    <li
                                        key={name}
                                        {...(name === this.props.lastOpenedNote ? '' : '')}
                                        className={`list-group-item sidebar-note ${activeNote}`}
                                        onClick={() => this.updateLastOpenedNote(name)}
                                    >
                                        {name}
                                    </li>
                                );
                            })}
                        </ul>

                    </div>
                </section>

            </div>
        );
    }
}

export default Sidebar;

// Helpers

// Creates note data object for sending out to the ipcMain process
function prepareNoteData(props: Props, noteData: string) {
    let noteDataToSave = {
        noteName: props.lastOpenedNote,
        notebookName: props.notebookName,
        noteData: noteData,
        noteDataTextOnly: striptags(noteData, [], '\n')
    };
    return noteDataToSave;
}