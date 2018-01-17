import * as React from 'react';
import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
import { ADD_NOTEBOOK } from '../../../constants/index';
import './index.css';
import * as $ from 'jquery';

export interface Props {
    onIncrement?: () => void;
    onDecrement?: () => void;
    showInput?: string;
    inputValue?: string;
    handleFocusOut?: void;
}

export class NewNotebookButton extends React.Component<Props, Props> {

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

        $('li.open-input').hide();
    }

    // Creates notebook on Enter key press
    handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            let notebook = this.prepareNotebook(this.state.inputValue as string);
            this.addNotebook(notebook);
            this.resetComponentState();
        }
    }

    // Creates notebook when input field loses focus
    handleFocusOut() {
        let notebook = this.prepareNotebook(this.state.inputValue as string);
        this.addNotebook(notebook);
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

    prepareNotebook(name: string) {
        return name.trim();
    }

    addNotebook(name: string) {
        if (name) {
            ElectronMessager.sendMessageWithIpcRenderer(ADD_NOTEBOOK, name);
        }
    }

    render() {
        return (
            <div className="add-notebook-form">
                <li 
                    className="open-input list-group-item sidebar-note sidebar-link" 
                    onClick={() => this.showInput()}
                >
                    New Notebook <span className="oi oi-book home-icon add-notebook"/>
                </li>

                <div className={`sidebar-app-form input-group input-group-sm ${this.state.showInput}`}>
                    <input 
                        value={this.state.inputValue}
                        onChange={e => this.updateInputValue(e)}
                        pattern="^[a-zA-Z0-9]+$"
                        ref={input => input && input.focus()}
                        onKeyPress={(e) => this.handleKeyPress(e)}
                        onBlur={() => this.handleFocusOut()}
                        type="text" 
                        className="form-control sidebar-app-form" 
                        aria-label="Notebook" 
                        aria-describedby="sizing-addon2"
                    />
                </div>
            </div>
        );
    }
}

export default NewNotebookButton;