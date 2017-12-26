import * as React from 'react';
import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
import { ADD_NOTEBOOK } from '../../../constants/index';
import './index.css';

export interface Props {
    onIncrement?: () => void;
    onDecrement?: () => void;
    showInput?: string;
}

export class NewNotebookButton extends React.Component<Props, Props> {

    constructor(props: Props) {
        super(props);
        this.state = {showInput: 'hidden'};
    }

    addNotebook(name: string) {
        ElectronMessager.sendMessageWithIpcRenderer(ADD_NOTEBOOK, name);
    }

    showInput() {
        let showInput = this.state.showInput === 'visible' ? 'hidden' : 'visible';
        this.setState({showInput: showInput});
    }

    render() {
        return (
            <div>
                <button 
                    // onClick={() => this.addNotebook('chemistry notes')}
                    onClick={() => this.showInput()}
                    type="button"
                    className="btn btn-secondary btn-sm add-notebook"
                >
                    Add Notebook
                </button>

                <div className={`input-group input-group-sm ${this.state.showInput}`}>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Username" 
                        aria-label="Username" 
                        aria-describedby="sizing-addon2"
                    />
                </div>
            </div>
        );
    }
}

export default NewNotebookButton;
