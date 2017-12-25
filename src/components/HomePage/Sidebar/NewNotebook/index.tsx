import * as React from 'react';

export interface Props {
    onIncrement?: () => void;
    onDecrement?: () => void;
}

export class NewNotebookButton extends React.Component<Props, Props> {
    render() {
        return (
            <div>
                <button 
                    onClick={this.props.onIncrement}
                    type="button"
                    className="btn btn-secondary btn-sm add-notebook"
                    data-toggle="modal"
                    data-target="#exampleModal"
                >
                    Add Notebook
                </button>
            </div>
        );
    }
}

export default NewNotebookButton;
