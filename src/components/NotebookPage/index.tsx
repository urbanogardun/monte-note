import * as React from 'react';
import Sidebar from '../../containers/NotebookPage/Sidebar';
import { Link } from 'react-router-dom';
import ElectronMessager from '../../utils/electron-messaging/electronMessager';
import { GET_NOTES, UPDATE_NOTE } from '../../constants/index';
import Quill, { DeltaStatic } from 'quill';
import '../../assets/css/quill.snow.css';

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

    quill: Quill;
    timeout: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            notebookName: this.props.location.pathname.split('/').pop(),
            lastOpenedNote: this.props.lastOpenedNote as string,
        };
    }

    componentDidMount() {
        this.quill = new Quill('#editor-container', {
            modules: {
              toolbar: [
                ['bold', 'italic', 'underline'],
                ['image', 'code-block']
              ]
            },
            placeholder: 'Take notes...',
            theme: 'snow'  // or 'bubble'
        });

        this.quill.on('text-change', (delta: DeltaStatic, oldContents: DeltaStatic) => {
            
            clearTimeout(this.timeout);
            this.timeout = setTimeout(updateNote, 60000);

            let noteName = this.props.lastOpenedNote;
            let notebookName = this.state.notebookName;
            let editor = document.querySelector('.ql-editor') as Element;
            let noteData = editor.innerHTML;

            function updateNote() {
                let data = {
                    noteName: noteName,
                    notebookName: notebookName,
                    noteData: noteData
                };
                ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE, data);
            }
        });
    }

    componentWillMount() {
        ElectronMessager.sendMessageWithIpcRenderer(GET_NOTES, this.state.notebookName);
    }

    componentWillUpdate(nextProps: Props) {
        // Load saved content from note file into Quill editor
        let editor = document.querySelector('.ql-editor') as Element;
        editor.innerHTML = nextProps.noteContent as string;

        // Enables/disables Quill editor if any notes exist in a notebook
        if (!nextProps.lastOpenedNote) {
            this.quill.disable();
        } else {
            this.quill.enable();
            this.quill.focus();
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <Sidebar notebookName={this.state.notebookName} />
                    <div className="col-sm">
                        <Link to="/">Home</Link>
                        <h4>Notebook: {this.state.notebookName}</h4>
                        <h4>Editing Note: {this.props.lastOpenedNote}</h4>
                        <div id="editor-container" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Notebook;