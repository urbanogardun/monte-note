import * as React from 'react';
import TrashcanEditor from './Editor/index';
import TrashcanSidebar from './Sidebar/index';
import './index.css';
import electronMessager from '../../utils/electron-messaging/electronMessager';
import { GET_TRASH } from '../../constants/index';

export interface Props {
    trash: object;
    noteContent: string;
    lastOpenedTrashNote: string;
    lastOpenedTrashNotebook: string;
}

export interface State {}

export class Trashcan extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    componentWillMount() {
        electronMessager.sendMessageWithIpcRenderer(GET_TRASH);
    }

    render() {
        return (
            <div className="container-fluid trashcan-container">
                <div className="row">
                    <TrashcanSidebar trash={this.props.trash} />
                    <TrashcanEditor 
                        noteContent={this.props.noteContent} 
                        note={this.props.lastOpenedTrashNote} 
                        notebook={this.props.lastOpenedTrashNotebook}
                    />
                </div>
            </div>
        );
    }
}

export default Trashcan;