import * as React from 'react';
// import Sidebar from '../../containers/NotebookPage/Sidebar';
import Sidebar from './Sidebar/index';
import Editor from './Editor/index';
import '../../assets/css/quill.snow.css';
import './index.css';

export interface Props {
    location: any;
    lastOpenedNote: string;
    noteContent: string;
    notes: string[];
    updateNotes: Function;
    updateLastOpenedNote: Function;
    updateNoteContent: Function;
    addTagToNote: Function;
    currentNoteTags: string[];
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

    render() {
        return (
            <div className="container-fluid notebook-container">
                <div className="row">
                    <Sidebar 
                        notebookName={this.state.notebookName}
                        notes={this.props.notes}
                        noteContent={this.props.noteContent}
                        lastOpenedNote={this.props.lastOpenedNote}
                        updateNotes={this.props.updateNotes}
                        updateLastOpenedNote={this.props.updateLastOpenedNote}
                        updateNoteContent={this.props.updateNoteContent}
                    />
                    <Editor 
                        notebookName={this.state.notebookName}
                        lastOpenedNote={this.props.lastOpenedNote}
                        noteContent={this.props.noteContent}
                        addTagToNote={this.props.addTagToNote}
                        currentNoteTags={this.props.currentNoteTags}
                    />
                </div>
            </div>
        );
    }
}

export default Notebook;