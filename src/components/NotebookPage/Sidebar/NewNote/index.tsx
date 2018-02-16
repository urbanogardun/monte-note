import * as React from 'react';
import ElectronMessager from '../../../../utils/electron-messaging/electronMessager';
import { 
    ADD_NOTE, 
    UPDATE_NOTE_STATE, 
    GET_NOTES, 
    UPDATE_NOTE,
} from '../../../../constants/index';
import * as $ from 'jquery';
var striptags = require('../../../../utils/striptags');

export interface Props {
    location?: any;
    notebookName: string;
    notes: string[];
    noteContent: string;
    lastOpenedNote: string;
    updateNotes: Function;
    updateLastOpenedNote: Function;
    updateNoteContent: Function;
    noteToRename: any;
    sidebarSize: string;
}

export interface State {
    showInput: string;
    inputValue: string;
    lastOpenedNote: string;
    noteContent: string;
    notes: string[];
}

export class NewNote extends React.Component<Props, State> {
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

        let noteContentToUpdate = $('.ql-editor').html();

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

    exitIfEscPressed(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Escape') {
            this.resetComponentState();
            $('li.open-input').show();
        }
    }

    render() {
        let componentToRender;
        if (this.props.sidebarSize === 'lg') {
            componentToRender = (
                <React.Fragment>
                    <ul className="list-group notes">
                        <li
                            className="open-input list-group-item sidebar-note sidebar-link new-notebook-sidebar-link-lg"
                            onClick={() => this.showInput()}
                        >
                            New Note
                            <span className="oi oi-document document-icon home-icon add-notebook notebook-icon-sidebar-lg " />
                        </li>
                    </ul>

                    <div className={`sidebar-app-form input-group input-group-sm ${this.state.showInput}`}>
                        <input
                            value={this.state.inputValue}
                            onChange={e => this.updateInputValue(e)}
                            pattern="^[a-zA-Z0-9]+$"
                            ref={input => input && input.focus()}
                            onKeyPress={(e) => this.handleKeyPress(e)}
                            onKeyDown={(e) => this.exitIfEscPressed(e)}
                            onBlur={() => this.handleFocusOut()}
                            type="text"
                            className="form-control sidebar-lg sidebar-app-form"
                            aria-label="Note"
                            aria-describedby="sizing-addon2"
                        />
                    </div>
                </React.Fragment>
            );
        } else if (this.props.sidebarSize === 'md') {
            componentToRender = (
                <div className={`sidebar-app-form input-group input-group-sm visible`}>
                    <input
                        value={this.state.inputValue}
                        onChange={e => this.updateInputValue(e)}
                        pattern="^[a-zA-Z0-9]+$"
                        ref={input => input && input.focus()}
                        onKeyPress={(e) => this.handleKeyPress(e)}
                        onKeyDown={(e) => this.exitIfEscPressed(e)}
                        onBlur={() => this.handleFocusOut()}
                        type="text"
                        className="form-control add-note sidebar-app-form sidebar-md"
                        aria-label="Note"
                        aria-describedby="sizing-addon2"
                    />
                </div>
            );
        } else if (this.props.sidebarSize === 'sm') {
            componentToRender = (
                <React.Fragment>
                    <li
                        className="nav-item open-input"
                    >
                        <a
                            className="nav-link"
                            href="#"
                            onClick={() => this.showInput()}
                        >
                            New Note
                        </a>
                    </li>

                    <li className="nav-item new-notebook-input-hamburger">
                        <div className={`input-group input-group-sm ${this.state.showInput}`}>
                            <input
                                value={this.state.inputValue}
                                onChange={e => this.updateInputValue(e)}
                                pattern="^[a-zA-Z0-9]+$"
                                ref={input => input && input.focus()}
                                onKeyPress={(e) => this.handleKeyPress(e)}
                                onKeyDown={(e) => this.exitIfEscPressed(e)}
                                onBlur={() => this.handleFocusOut()}
                                type="text"
                                className="form-control new-notebook-hamburger"
                                aria-label="Note"
                                aria-describedby="sizing-addon2"
                            />
                        </div>
                    </li>
                </React.Fragment>
            );
        }
        return (
            componentToRender
        );
    }
}

export default NewNote;

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