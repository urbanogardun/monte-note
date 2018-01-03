import * as React from 'react';
import Sidebar from './Sidebar/index';
import { Link } from 'react-router-dom';

export interface Props {
    location: any;
}

export class Notebook extends React.Component<Props, {}> {
    render() {
        // Gets notebook name from the path url
        let notebookName = this.props.location.pathname.split('/').pop();
        return (
            <div className="container-fluid">
                <div className="row">
                    <Sidebar />
                    <div className="col-sm">
                        <Link to="/">Home</Link>
                        <h1>Note Content</h1>
                        <h4>{notebookName}</h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default Notebook;