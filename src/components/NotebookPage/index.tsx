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
    pathToNewestUploadedImage: string;
    pathToNewestUploadedAsset: any;
    updatePreviewContent: Function;
    noteToRename: any;
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
                        noteToRename={this.props.noteToRename}
                    />
                    <Editor 
                        notebookName={this.state.notebookName}
                        lastOpenedNote={this.props.lastOpenedNote}
                        noteContent={this.props.noteContent}
                        addTagToNote={this.props.addTagToNote}
                        currentNoteTags={this.props.currentNoteTags}
                        notes={this.props.notes}
                        updateNotes={this.props.updateNotes}
                        updateLastOpenedNote={this.props.updateLastOpenedNote}
                        updateNoteContent={this.props.updateNoteContent}
                        pathToNewestUploadedImage={this.props.pathToNewestUploadedImage}
                        pathToNewestUploadedAsset={this.props.pathToNewestUploadedAsset}
                        updatePreviewContent={this.props.updatePreviewContent}
                    />
                </div>
            </div>
        );
    }
}

export default Notebook;