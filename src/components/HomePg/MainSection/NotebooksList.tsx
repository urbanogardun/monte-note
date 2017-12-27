import * as React from 'react';

export interface Props {}

export interface State {}

export class NotebooksList extends React.Component<Props, State> {

    render() {
        return (
            <div className="col-sm-4">
                <h1>Notebooks List!</h1>
            </div>
        );
    }
}

export default NotebooksList;