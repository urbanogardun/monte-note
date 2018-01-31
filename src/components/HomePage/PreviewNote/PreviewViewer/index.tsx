import * as React from 'react';
import Quill from 'quill';

export interface Props {
    previewContent: any;

}

export interface State {
    noteUpdated: boolean
}

export class PreviewViewer extends React.Component<Props, State> {

    quill: Quill;

    constructor(props: Props) {
        super(props);
        this.state = {
            noteUpdated: false
        };
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
        // Anytime we switch between notes, load note content inside editor
        if ( (this.props.previewContent.note !== nextProps.previewContent.note)
         || (this.props.previewContent.notebook !== nextProps.previewContent.notebook) 
         || (this.props.previewContent.noteContent !== nextProps.previewContent.noteContent)
         || (this.state.noteUpdated === true) ) {
            this.quill.deleteText(0, this.quill.getLength());
            this.quill.clipboard.dangerouslyPasteHTML(0, nextProps.previewContent.noteContent as string, 'api');
        }
    }

    componentWillMount() {
        // When a tag gets added to note inside a Notebook page and we navigate
        // back to Home page after that, this will render newest tag with old
        // ones in a preview viewer.
        this.setState({noteUpdated: true}, () => {
            this.componentWillUpdate(this.props);
        });
    }

    render() {
        return (
            <div id="quill-container" className="preview-note-container" />
        );
    }
}

export default PreviewViewer;
