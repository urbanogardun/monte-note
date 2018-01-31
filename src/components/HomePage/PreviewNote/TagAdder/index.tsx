import * as React from 'react';
import ElectronMessager from '../../../../utils/electron-messaging/electronMessager';
import { ADD_TAG_TO_NOTE } from '../../../../constants/index';

export interface Props {
    tags: string[];
    notebookName: string;
    noteName: string;
    updateTags: Function;
    updateAllTags: Function;
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
                note: this.props.noteName,
                tag: this.state.tag
            };
            ElectronMessager.sendMessageWithIpcRenderer(ADD_TAG_TO_NOTE, data);

            let notes = this.props.tags;
            notes.push(this.state.tag);

            // Update list of tags in app state with tag that is about to be added
            this.props.updateTags(notes);
            this.props.updateAllTags(this.state.tag);
            
            this.setState({tag: ''});
        }
    }

    updateInputValue(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({tag: e.target.value});
    }

    render() {
        return (
            <div className="input-group input-group-sm mb-3">
                <input
                    value={this.state.tag}
                    onChange={e => this.updateInputValue(e)}
                    type="text"
                    className="form-control"
                    aria-label="Small"
                    placeholder="Add a tag..."
                    aria-describedby="inputGroup-sizing-sm"
                    onKeyPress={(e) => this.handleKeyPress(e)}
                />
            </div>
        );
    }
}

export default TagAdder;
