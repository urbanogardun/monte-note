import * as React from 'react';
import TagList from '../TagList/index';
import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
import { ADD_TAG_TO_NOTE } from '../../../constants/index';

export interface Props {
    notebookName: string;
    lastOpenedNote: string;
    addTagToNote: Function;
    currentNoteTags: string[];
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
        }
    }

    updateInputValue(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({tag: e.target.value});
    }

    render() {
        return (
            <div className="tag-manager">
                <div className="input-group input-group-sm mb-3 add-tags">
                    <div className="input-group-prepend">
                        <button className="btn btn-outline-secondary" type="button">Add</button>
                    </div>
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
                />
            </div>
        );
    }
}

export default TagAdder;