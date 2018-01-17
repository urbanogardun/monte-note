import * as React from 'react';
import ElectronMessager from '../../../../utils/electron-messaging/electronMessager';
import { UPDATE_NOTE_STATE } from '../../../../constants/index';

export interface Props {
    notebookName: string;
    noteName: string;
}

export interface State {}

export class GoToNote extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    openNote(notebook: string, note: string) {
        let data = {
            notebookName: notebook,
            noteName: note
        };
        // Set note we are about to open to be the last opened one in that
        // notebook
        ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE_STATE, data);
        window.location.href = `/notebooks/${notebook}`;
    }

    render() {
        return (
            <div>
                <a 
                    href="#" 
                    onClick={() => this.openNote(this.props.notebookName, this.props.noteName)}
                >
                    Open Note
                </a>
            </div>
        );
    }
}

export default GoToNote;
