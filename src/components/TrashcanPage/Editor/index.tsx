import * as React from 'react';

export interface Props { }

export interface State { }

export class TrashcanEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div className="col trashcan main-content">
                <h1>Editor</h1>
            </div>
        );
    }
}

export default TrashcanEditor;
