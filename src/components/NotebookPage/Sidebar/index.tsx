import * as React from 'react';
import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
import { ADD_NOTE, UPDATE_NOTE_STATE, GET_NOTES, UPDATE_NOTE, DELETE_NOTE } from '../../../constants/index';

export interface Props {
    location?: any;
    notebookName: string;
    notes?: string[];
    noteContent?: string;
    lastOpenedNote?: string;
    updateNotes?: (notes: string[]) => void;
    updateLastOpenedNote?: (note: string) => void;
    updateNoteContent?: (content: string) => void;
}

export interface State {
    showInput: string;
    inputValue: string;
    lastOpenedNote: string;
    noteContent: string;
}

export class Sidebar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showInput: 'hidden',
            inputValue: '',
            lastOpenedNote: '',
            noteContent: ''
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
            let data = {notebookName: this.props.notebookName, noteName: name};
            ElectronMessager.sendMessageWithIpcRenderer(ADD_NOTE, data);
            ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE_STATE, data);
        }
    }

    updateLastOpenedNote(name: string) {
        if (this.props.lastOpenedNote !== name) {
            let editor = document.querySelector('.ql-editor') as Element;
            let noteData = editor.innerHTML;
            this.setState(
                {lastOpenedNote: this.props.lastOpenedNote as string,
                noteContent: noteData}
            );
            let data = {notebookName: this.props.notebookName, noteName: name};
            ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE_STATE, data);
        }
    }

    deleteNote(name: string) {
        let data = {
            noteName: name,
            notebookName: this.props.notebookName,
            noteData: '',
        };

        // Removes note from app state & sets last opened note to be the last
        // note from the notes array
        let newNotes = removeNote(this.props.notes as string[], name);
        let updateNotes = this.props.updateNotes as Function;
        updateNotes(newNotes);

        // When deleting a currently opened note, save current note data before
        // deleting it
        if (this.props.lastOpenedNote === name) {
            let editor = document.querySelector('.ql-editor') as Element;
            let noteData = editor.innerHTML;
            data.noteData = noteData;
            let updateLastOpenedNote = this.props.updateLastOpenedNote as Function;
            ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE, data);
            updateLastOpenedNote(newNotes.pop());
        }
        
        let updateNoteContent = this.props.updateNoteContent as Function;
        updateNoteContent(this.props.noteContent);

        let noteToDelete = {note: data.noteName, notebook: data.notebookName};
        ElectronMessager.sendMessageWithIpcRenderer(DELETE_NOTE, noteToDelete);
    }

    componentWillReceiveProps(nextProps: Props) {
        // Saves current note data when we navigate to another note
        if ( (nextProps.noteContent !== '') && (this.state.lastOpenedNote) ) {
            if ( (this.state.lastOpenedNote) !== (nextProps.lastOpenedNote) ) {
                let data = {
                    noteName: this.state.lastOpenedNote,
                    notebookName: this.props.notebookName,
                    noteData: this.state.noteContent
                };
                ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE, data);
            }
        }
    }

    componentWillUnmount() {
        // Saves current note data when we leave the notebook
        let editor = document.querySelector('.ql-editor') as Element;
        let noteData = editor.innerHTML;
        let data = {
            noteName: this.props.lastOpenedNote,
            notebookName: this.props.notebookName,
            noteData: noteData
        };
        ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE, data);
    }

    render() {
        return (
            <div className="col-sm-2 sidebar">
                <button 
                    onClick={() => this.showInput()}
                    type="button"
                    className="btn btn-secondary btn-sm add-note"
                >
                    Add Note
                </button>

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

                <h3>Notes List</h3>

                <ul>
                    {(this.props.notes as string[]).map((name: string, index: number) => {
                        return (
                        <div key={name}>
                            <li onClick={() => this.updateLastOpenedNote(name)}>{name}</li>
                            <span onClick={() => this.deleteNote(name)}> X</span>
                        </div>
                        );
                    })}
                </ul>

            </div> 
        );
    }
}

export default Sidebar;

// Helpers
function removeNote(notesList: string[], noteName: string): string[] {
    return notesList.filter((note: string) => { return note !== noteName ? true : false; } );
}