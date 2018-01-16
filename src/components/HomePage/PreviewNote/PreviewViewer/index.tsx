import * as React from 'react';
import Quill from 'quill';

export interface Props {}

export interface State {}

export class PreviewViewer extends React.Component<Props, State> {

    quill: Quill;

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        this.quill = new Quill('#quill-container', {
            modules: {
                toolbar: false
            },
            theme: 'snow'  // or 'bubble',
        });
        this.quill.disable();
    }

    componentWillUpdate(nextProps: Props) {
        // // Anytime we switch between notes, load note content inside editor
        // this.quill.deleteText(0, this.quill.getLength());
        // // Don't load content into editor unless user clicked on a trashed note
        // if ( (nextProps.notebook !== '') && (nextProps.note !== '') ) {
        //     this.quill.clipboard.dangerouslyPasteHTML(0, nextProps.noteContent as string, 'api');
        // }
    }

    render() {
        return (
            <div id="quill-container" className="preview-note-container" />
        );
    }
}

export default PreviewViewer;
