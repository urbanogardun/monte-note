import * as React from 'react';

function Button() {
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

export default Button;
