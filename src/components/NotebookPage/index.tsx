import * as React from 'react';
import Sidebar from '../../containers/NotebookPage/Sidebar';
import { Link } from 'react-router-dom';
import ElectronMessager from '../../utils/electron-messaging/electronMessager';
import { GET_NOTES } from '../../constants/index';

export interface Props {
    location: any;
}

export interface State {
    notebookName: string;
}

export class Notebook extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            notebookName: this.props.location.pathname.split('/').pop(),
        };
    }

    componentWillMount() {
        ElectronMessager.sendMessageWithIpcRenderer(GET_NOTES, this.state.notebookName);
    }

    render() {
        // Gets notebook name from the path url
        return (
            <div className="container-fluid">
                <div className="row">
                    <Sidebar notebookName={this.state.notebookName} />
                    <div className="col-sm">
                        <Link to="/">Home</Link>
                        <h1>Note Content</h1>
                        <h4>{this.state.notebookName}</h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default Notebook;