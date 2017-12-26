import * as React from 'react';

export interface Props {
    onIncrement?: () => void;
    onDecrement?: () => void;
}

export class NewNotebookButton extends React.Component<Props, Props> {

    addNotebook(name: string) {
        console.log(`Add notebook directory: ${name}`);
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
