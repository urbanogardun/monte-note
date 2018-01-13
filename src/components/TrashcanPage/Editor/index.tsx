import * as React from 'react';
import Quill from 'quill';

export interface Props {
    noteContent?: string;
}

export interface State { }

export class TrashcanEditor extends React.Component<Props, State> {

    quill: Quill;

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        this.quill = new Quill('#quill-container', {
            modules: {
                toolbar: []
            },
            theme: 'snow'  // or 'bubble',
        });
        this.quill.disable();
    }

    componentWillUpdate(nextProps: Props) {
        // Anytime we switch between notes, load note content inside editor
        this.quill.deleteText(0, this.quill.getLength());
        this.quill.clipboard.dangerouslyPasteHTML(0, nextProps.noteContent as string, 'api');
    }

    render() {
        return (
            <div className="col trashcan main-content">
                <div id="quill-container" />
            </div>
        );
    }
}

export default TrashcanEditor;
