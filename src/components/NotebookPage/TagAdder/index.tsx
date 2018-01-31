import * as React from 'react';
import TagList from '../TagList/index';
import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
import { ADD_TAG_TO_NOTE, UPDATE_NOTE } from '../../../constants/index';
const striptags = require('../../../utils/striptags');

export interface Props {
    notebookName: string;
    lastOpenedNote: string;
    addTagToNote: Function;
    currentNoteTags: string[];
    updateNoteContent: Function;
    noteContent: string;
}

export interface State {
    tag: string;
}

export class TagAdder extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            tag: ''
        };
    }

    // Adds tag on Enter key press
    handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            let data = {
                notebook: this.props.notebookName,
                note: this.props.lastOpenedNote,
                tag: this.state.tag
            };
            let notes = this.props.currentNoteTags;
            notes.push(this.state.tag);
            // Update list of tags in app state with tag that is about to be added
            this.props.addTagToNote(notes);

            ElectronMessager.sendMessageWithIpcRenderer(ADD_TAG_TO_NOTE, data);

            // Save current note content that is inside an editor
            let editor = document.querySelector('.ql-editor') as Element;
            let noteContentToUpdate = editor.innerHTML;

            let noteData = prepareNoteData(this.props, noteContentToUpdate);
            let noteDataToSave = {...noteData, updatePreviewContent: true};
            ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE, noteDataToSave);

            // Update app state with current note content that's inside editor
            this.props.updateNoteContent(noteContentToUpdate);

            this.setState({tag: ''});
        }
    }

    updateInputValue(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({tag: e.target.value});
    }

    render() {
        return (
            <div className="tag-manager">
                <div className="input-group input-group-sm mb-3 add-tags">
                    <input 
                        value={this.state.tag}
                        onChange={e => this.updateInputValue(e)}
                        type="text"
                        className="form-control" 
                        aria-label="Small" 
                        placeholder="Tag name..." 
                        aria-describedby="inputGroup-sizing-sm"
                        onKeyPress={(e) => this.handleKeyPress(e)}
                    />
                </div>
                <TagList 
                    notebookName={this.props.notebookName}
                    noteName={this.props.lastOpenedNote}
                    currentNoteTags={this.props.currentNoteTags}
                    updateTags={this.props.addTagToNote}
                />
            </div>
        );
    }
}

export default TagAdder;

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