import * as React from 'react';
import Sidebar from '../../containers/NotebookPage/Sidebar';
import '../../assets/css/quill.snow.css';
import Editor from '../../containers/NotebookPage/Editor';

export interface Props {
    location: any;
    lastOpenedNote?: string;
    noteContent?: string;
}

export interface State {
    notebookName: string;
    lastOpenedNote: string;
}

export class Notebook extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            notebookName: this.props.location.pathname.split('/').pop(),
            lastOpenedNote: this.props.lastOpenedNote as string,
        };
    }

    componentWillMount() {
        this.forceUpdate();
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <Sidebar notebookName={this.state.notebookName} />
                    <Editor notebookName={this.state.notebookName} />
                </div>
            </div>
        );
    }
}

export default Notebook;