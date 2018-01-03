import * as React from 'react';

export interface Props {
    location: any;
}

export class Notebook extends React.Component<Props, {}> {
    render() {
        console.log(this.props.location);
        return (
            <div>
                <h1>Notebook Page</h1>
                <p>NOTEBOOKZZZZZZZZ</p>
            </div>
        );
    }
}

export default Notebook;