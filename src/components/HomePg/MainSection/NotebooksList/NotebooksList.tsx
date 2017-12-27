import * as React from 'react';
var notebooksData = require('../../../../store/store.json');

export interface Props {
    notebooks?: string[];
}

export interface State {
    notebooks: string[];
}

export class NotebooksList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            notebooks: notebooksData.notebooks,
        }
    }

    componentDidMount() {
        console.log(notebooksData);
    }

    render() {
        return (
            <div className="col-sm-4">
                <h1>Notebooks List!</h1>
                <ul>
                    {(this.state.notebooks as string[]).map((name: string, index: number) => {
                        return <li key={index}>{name}</li>;
                    })}
                </ul>
            </div>
        );
    }
}

export default NotebooksList;