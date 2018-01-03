import * as React from 'react';

export interface Props {
    location: any;
}

export class Notebook extends React.Component<Props, {}> {
    render() {
        // Gets notebook name from the path url
        let notebookName = this.props.location.pathname.split('/').pop();
        return (
            <div>
                <h1>Notebook: {notebookName}</h1>
                <p>NOTEBOOKZZZZZZZZ</p>
            </div>
        );
    }
}

export default Notebook;