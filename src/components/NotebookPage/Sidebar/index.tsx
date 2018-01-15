import * as React from 'react';
import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
// import { ADD_NOTE, UPDATE_NOTE_STATE, GET_NOTES, UPDATE_NOTE, DELETE_NOTE } from '../../../constants/index';
import { ADD_NOTE, UPDATE_NOTE_STATE, GET_NOTES, UPDATE_NOTE } from '../../../constants/index';
import { Link } from 'react-router-dom';
var striptags = require('striptags');

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
        if (name) {
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

    updateLastOpenedNote(name: string) {
        let editor = document.querySelector('.ql-editor') as Element;
        let noteContentToUpdate = editor.innerHTML;

        let noteDataToSave = {
            noteName: this.props.lastOpenedNote,
            notebookName: this.props.notebookName,
            noteData: noteContentToUpdate,
            noteDataTextOnly: striptags(noteContentToUpdate)
        };

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

    componentWillReceiveProps(nextProps: Props) {
        // // This will save content of note that just got added to
        // // notebook when user navigates to another note.
        // if (this.state.notes.indexOf(this.props.lastOpenedNote) === -1) {
        //     this.setState(
        //         {
        //             notes: this.props.notes
        //         }
        //     );

        //     let editor = document.querySelector('.ql-editor') as Element;
        //     let noteData = editor.innerHTML;

        //     let data = {
        //         noteName: this.state.lastOpenedNote,
        //         notebookName: this.props.notebookName,
        //         noteData: noteData,
        //         noteDataTextOnly: striptags(noteData)
        //     };
        //     ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE, data);
        // } else {

        //     // Saves current note data when we navigate to another note
        //     if ( (nextProps.noteContent !== '') && (this.state.lastOpenedNote) ) {
        //         if ( (this.props.lastOpenedNote) !== (nextProps.lastOpenedNote) ) {
        //             let data = {
        //                 noteName: this.state.lastOpenedNote,
        //                 notebookName: this.props.notebookName,
        //                 noteData: this.state.noteContent,
        //                 noteDataTextOnly: striptags(this.state.noteContent)
        //             };
        //             ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE, data);
        //         }
        //     }

        // }

    }

    componentWillUnmount() {
        // Saves current note data when we leave the notebook
        // let editor = document.querySelector('.ql-editor') as Element;
        // let noteData = editor.innerHTML;
        // let data = {
        //     noteName: this.props.lastOpenedNote,
        //     notebookName: this.props.notebookName,
        //     noteData: noteData
        // };
        // ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE, data);
    }

    render() {
        return (
            <div className="col-sm-2 trashcan sidebar">
                <section className="links">
                    <ul className="list-group notes">
                        <Link className="home-sidebar" to="/">
                            <li 
                                className="notebook-name-sidebar list-group-item sidebar-note"
                            >
                                Home
                                <span className="oi oi-home home-icon"/>
                            </li>
                        </Link>
                    </ul>
                </section>
                <section className="links">
                    <ul className="list-group notes">
                        <li 
                            className="list-group-item sidebar-note add-note"
                            onClick={() => this.showInput()}
                        >
                            Add Note 
                            <span className="oi oi-home home-icon"/>
                        </li>
                    </ul>
                    <div className={`input-group input-group-sm ${this.state.showInput}`}>
                    <input 
                        value={this.state.inputValue}
                        onChange={e => this.updateInputValue(e)}
                        pattern="^[a-zA-Z0-9]+$"
                        ref={input => input && input.focus()}
                        onKeyPress={(e) => this.handleKeyPress(e)}
                        onBlur={() => this.handleFocusOut()}
                        type="text" 
                        className="form-control" 
                        placeholder="Note" 
                        aria-label="Note" 
                        aria-describedby="sizing-addon2"
                    />
                    </div>
                </section>
                <section className="notebooks">
                    <ul className="list-group notes">
                        {(this.props.notes as string[]).map((name: string, index: number) => {
                            let activeNote = name === this.props.lastOpenedNote ? 'notebook-name-sidebar-active' : '';
                            return (
                            <li 
                                key={name} 
                                {...(name === this.props.lastOpenedNote ? '' : '')}
                                className={`list-group-item sidebar-note ${activeNote}`}
                                onClick={() => this.updateLastOpenedNote(name)}
                            >
                            {name}
                            </li>
                                // <span onClick={() => this.deleteNote(name)}> X</span>
                            );
                        })}
                    </ul>
                </section>
            </div> 
        );
    }
}

export default Sidebar;

// // Helpers
// function removeNote(notesList: string[], noteName: string): string[] {
//     return notesList.filter((note: string) => { return note !== noteName ? true : false; } );
// }

// Refactor saving of note content on different user actions