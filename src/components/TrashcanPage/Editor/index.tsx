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
                toolbar: [
                    ['omega']
                ]
            },
            theme: 'snow'  // or 'bubble',
        });
        this.quill.disable();

        let toolbar = this.quill.getModule('toolbar');
        toolbar.addHandler('omega');

        // Adds text on hover & custom icon to button
        let customButton = document.querySelector('.ql-omega') as Element;
        customButton.setAttribute('title', 'Restore note');
        customButton.innerHTML = '<span class="oi oi-loop-square quill-custom-button"></span>';
        customButton.addEventListener('click', function() {
            console.log('Restore note');
        });
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
