import * as React from 'react';
import ElectronMessager from '../../../../utils/electron-messaging/electronMessager';
import { UPDATE_NOTE_STATE } from '../../../../constants/index';

export interface Props {
    notebookName: string;
    noteName: string;
    goToRoute: Function;
    lastOpenedNote: string;
}

export interface State {
    noteToOpen: string;
    notebookToOpen: string;
}

export class GoToNote extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            noteToOpen: '',
            notebookToOpen: ''
        };
    }

    openNote(notebook: string, note: string) {
        let data = {
            notebookName: notebook,
            noteName: note
        };

        this.setState({
            notebookToOpen: notebook,
            noteToOpen: note
        });

        // Set note we are about to open to be the last opened one in that
        // notebook
        ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE_STATE, data);
    }

    componentWillUpdate(nextProps: Props) {
        // Check that note we are about to go to has been set as the lastOpenedNote
        // inside DB. With this check we won't see for a split second content
        // of a previous note in that notebook.
        if (this.state.noteToOpen) {
            if (this.state.noteToOpen === nextProps.lastOpenedNote) {
                this.props.goToRoute(`/notebooks/${this.state.notebookToOpen}`);
            }
        }
    }

    render() {
        return (
            <div>
                <a 
                    href="#" 
                    onClick={(e) => this.openNote(this.props.notebookName, this.props.noteName)}
                >
                    Open Note
                </a>
            </div>
        );
    }
}

export default GoToNote;
