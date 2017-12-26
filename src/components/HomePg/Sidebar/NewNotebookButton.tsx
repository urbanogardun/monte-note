import * as React from 'react';
import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
import { ADD_NOTEBOOK } from '../../../constants/index';

export interface Props {
    onIncrement?: () => void;
    onDecrement?: () => void;
}

export class NewNotebookButton extends React.Component<Props, Props> {

    addNotebook(name: string) {
        ElectronMessager.sendMessageWithIpcRenderer(ADD_NOTEBOOK, name);
    }

    render() {
        return (
            <div>
                <button 
                    onClick={() => this.addNotebook('chemistry notes')}
                    type="button"
                    className="btn btn-secondary btn-sm add-notebook"
                >
                    Add Notebook
                </button>
            </div>
        );
    }
}

export default NewNotebookButton;
