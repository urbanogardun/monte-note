import * as React from 'react';

export interface Props {
    notebooks?: string[];
}

export interface State {}

export class NotebooksList extends React.Component<Props, State> {
    render() {
        return (
            <div className="col-sm-4">
                <h1>Notebooks List!</h1>
                <ul>
                    {(this.props.notebooks as string[]).map((name: string, index: number) => {
                        return <li key={index}>{name}</li>;
                    })}
                </ul>

            </div>
        );
    }
}

export default NotebooksList;