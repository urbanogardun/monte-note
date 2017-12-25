import * as React from 'react';

export class NewNotebookButton extends React.Component {
    
    render() {
        return (
            <div>
                <button
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
