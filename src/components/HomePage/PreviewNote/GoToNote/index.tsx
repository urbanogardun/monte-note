import * as React from 'react';
import ElectronMessager from '../../../../utils/electron-messaging/electronMessager';
import { UPDATE_NOTE_STATE } from '../../../../constants/index';
import { Route } from 'react-router';

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
            notebookToOpen: '',
        };
    }

    // openNote(notebook: string, note: string) {
    openNote(history: any) {
        // console.log(`notebook to open: ${notebook} note to open: ${note}`);
        let data = {
            notebookName: this.props.notebookName,
            noteName: this.props.noteName
        };

        // After state gets set, call componentWillUpdate with current props
        // which are actually new props we've received while waiting for state
        // to get updated.
        this.setState({
            notebookToOpen: this.props.notebookName,
            noteToOpen: this.props.noteName,
        },            () => {
            this.componentWillUpdate(this.props);
            history.push(`/notebooks/${this.props.notebookName}`);
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
                // this.props.goToRoute(`/notebooks/${this.state.notebookToOpen}`);
                return true;
            }
        }
        return false;
    }

    render() {
        return (
            <Route 
                render={({ history}) => (
                <a
                    href="#" 
                    onClick={() => { this.openNote(history); }}
                >
                  Click Me!
                </a>
              )} 
            />
        );
    }
}

export default GoToNote;
