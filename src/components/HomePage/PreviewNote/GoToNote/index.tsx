import * as React from 'react';

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
        console.log(`Open ${note} in notebook: ${notebook}`);
        // Set lastopenednote to note
        // Dynamically go to notebook path
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
