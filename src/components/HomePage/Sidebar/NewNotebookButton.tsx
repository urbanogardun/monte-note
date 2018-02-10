import * as React from 'react';
import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
import { ADD_NOTEBOOK, TRASHCAN } from '../../../constants/index';
import './index.css';
import * as $ from 'jquery';

export interface Props {
    onIncrement?: () => void;
    onDecrement?: () => void;
    showInput?: string;
    inputValue?: string;
    handleFocusOut?: void;
    goToRoute: Function;
    notebooks: string[];
    forHamburgerMenu?: boolean;
    forMediumSidebar?: boolean;
}

export interface State {
    showInput: string;
    inputValue: string;
}

export class NewNotebookButton extends React.Component<Props, State> {

    addedNotebook: string = '';

    constructor(props: Props) {
        super(props);
        this.state = {
            showInput: 'hidden',
            inputValue: '',
        };
        this.addNotebook = this.addNotebook.bind(this);
    }

    showInput(whereToRender?: string) {
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

    // Sets input field to blank value when focus is lost
    handleFocusOut() {
        this.resetComponentState();

        $('li.open-input').show();
    }

    exitIfEscPressed(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Escape') {
            this.resetComponentState();
            $('li.open-input').show();
        }
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
        if ( (name) && (name !== TRASHCAN) ) {
            ElectronMessager.sendMessageWithIpcRenderer(ADD_NOTEBOOK, name);
            this.addedNotebook = name as string;
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        // Go to notebook page of a notebook we just created
        if (nextProps.notebooks.indexOf(this.addedNotebook) > -1) {
            this.props.goToRoute(`/notebooks/${this.addedNotebook}`);
        }
    }

    render() {
        let newNotebookButton;
        if (this.props.forHamburgerMenu) {
            newNotebookButton = (
                <React.Fragment>
                    <li className="nav-item open-input">
                        <a
                            className="nav-link"
                            href="#"
                            onClick={(e) => { this.showInput(); }}
                        >
                            New Notebook
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
                                aria-label="Notebook" 
                                aria-describedby="sizing-addon2"
                            />
                        </div>
                    </li>
                </React.Fragment>
            );
        } else if (this.props.forMediumSidebar) {
            newNotebookButton = (
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
                        className="form-control sidebar-app-form sidebar-md"
                        aria-label="Notebook"
                        aria-describedby="sizing-addon2"
                    />
                </div>
            );
        } else {
            newNotebookButton = (
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
                            onKeyDown={(e) => this.exitIfEscPressed(e)}
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
        return (
            newNotebookButton
        );
    }
}

export default NewNotebookButton;