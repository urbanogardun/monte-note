import * as React from 'react';
import TrashcanEditor from './Editor/index';
import TrashcanSidebar from './Sidebar/index';
import './index.css';

export interface Props {}

export interface State {}

export class Trashcan extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div className="container-fluid trashcan-container">
                <div className="row">
                    <TrashcanSidebar />
                    <TrashcanEditor />
                </div>
            </div>
        );
    }
}

export default Trashcan;