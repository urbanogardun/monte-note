import * as React from 'react';
import PreviewViewer from './PreviewViewer/index';
import TagAdder from './TagAdder/index';
import GoToNote from './GoToNote/index';
import TagList from './TagList/index';

export interface Props {
    previewContent: any;
    updateTags: Function;
    goToRoute: Function;
}

export interface State {}

export class PreviewNote extends React.Component<Props, State> {

    render() {

        let componentsToRender = (
            <div className="col preview-note-content" />
        );

        // Display components only if a note has been selected for a preview
        if (this.props.previewContent.note) {

            componentsToRender = (
                <div className="col preview-note-content">
                    <TagAdder 
                        tags={this.props.previewContent.tags}
                        notebookName={this.props.previewContent.notebook}
                        noteName={this.props.previewContent.note}
                        updateTags={this.props.updateTags} 
                    />
                    <GoToNote
                        notebookName={this.props.previewContent.notebook}
                        noteName={this.props.previewContent.note}
                        goToRoute={this.props.goToRoute}
                    />
                    <TagList 
                        tags={this.props.previewContent.tags}
                        notebookName={this.props.previewContent.notebook}
                        noteName={this.props.previewContent.note}
                        updateTags={this.props.updateTags} 
                    />
                    <PreviewViewer previewContent={this.props.previewContent} />
                </div>
            );

        }

        return (
            <div className="col preview-note-content">
                {componentsToRender}
            </div>
        );
    }
}

export default PreviewNote;
