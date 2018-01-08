import * as React from 'react';
import { Link } from 'react-router-dom';
import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
import { UPDATE_NOTE, GET_NAME_OF_LAST_OPENED_NOTE, GET_NOTE_CONTENT } from '../../../constants/index';
import Quill, { DeltaStatic } from 'quill';
import '../../../assets/css/quill.snow.css';

export interface Props {
    notebookName: string;
    lastOpenedNote?: string;
    noteContent?: string;
}

export interface State {
    notebookName: string;
    lastOpenedNote: string | null;
}

export class Editor extends React.Component<Props, State> {

    quill: Quill;
    timeout: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            notebookName: this.props.notebookName,
            lastOpenedNote: null,
        };
        ElectronMessager.sendMessageWithIpcRenderer(GET_NAME_OF_LAST_OPENED_NOTE, this.props.notebookName);
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

        this.quill.on('text-change', (delta: DeltaStatic, oldContents: DeltaStatic, source: any) => {
            
            let noteName = this.props.lastOpenedNote;
            let notebookName = this.state.notebookName;
            let editor = document.querySelector('.ql-editor') as Element;
            let noteData = editor.innerHTML;
            
            if (source === 'user') {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(updateNote, 60000);
            }

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

    componentWillReceiveProps(nextProps: Props) {
        if ((this.state.lastOpenedNote === null) || (this.state.lastOpenedNote !== nextProps.lastOpenedNote)) {
            this.setState({lastOpenedNote: nextProps.lastOpenedNote as string});

            let data = {
                notebook: this.state.notebookName,
                note: nextProps.lastOpenedNote
            };
            ElectronMessager.sendMessageWithIpcRenderer(GET_NOTE_CONTENT, data);
        }
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        if (nextProps.noteContent === 'GETTING_NOTE_CONTENT') {
            return false;
        }
        return true;
    }

    componentWillUpdate(nextProps: Props) {
        // Load saved content from note file into Quill editor
        this.quill.deleteText(0, this.quill.getLength());
        this.quill.clipboard.dangerouslyPasteHTML(0, nextProps.noteContent as string, 'api');

        // // Enables/disables Quill editor if any notes exist in a notebook
        // if (!nextProps.lastOpenedNote) {
        //     this.quill.disable();
        // } else {
        //     this.quill.enable();
        //     this.quill.focus();
        // }
    }

    render() {
        return (
            <div className="col-sm">
                <Link to="/">Home</Link>
                <h4>Notebook: {this.state.notebookName}</h4>
                <h4>Editing Note: {this.props.lastOpenedNote}</h4>
                <div id="editor-container" />
            </div>
        );
    }
}

export default Editor;