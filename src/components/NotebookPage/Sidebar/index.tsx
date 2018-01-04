import * as React from 'react';
import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
import { ADD_NOTE } from '../../../constants/index';

export interface Props {
    location?: any;
    notebookName: string;
    notes?: string[];
}

export interface State {
    showInput: string;
    inputValue: string;
}

export class Sidebar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showInput: 'hidden',
            inputValue: '',
        };
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
        }
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
                        return <li key={index}>{name}</li>;
                    })}
                </ul>

            </div> 
        );
    }
}

export default Sidebar;