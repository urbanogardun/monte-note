import * as React from 'react';
import PreviewViewer from './PreviewViewer/index';
import TagAdder from './TagAdder/index';
import GoToNote from './GoToNote/index';
import TagList from './TagList/index';
import * as $ from 'jquery';

export interface Props {
    previewContent: any;
    updateTags: Function;
    goToRoute: Function;
    lastOpenedNote: string;
    updateAllTags: Function;
}

export interface State {}

export class PreviewNote extends React.Component<Props, State> {

    componentWillUpdate(nextProps: Props) {
        if (nextProps.previewContent.note) {
            $('.preview-note-content').children().show();
        } else {
            $('.preview-note-content').children().hide();
        }
    }

    render() {
        return (
            <div className="col preview-note">
                <TagAdder
                    tags={this.props.previewContent.tags}
                    notebookName={this.props.previewContent.notebook}
                    noteName={this.props.previewContent.note}
                    updateTags={this.props.updateTags}
                    updateAllTags={this.props.updateAllTags}
                />
                <TagList
                    tags={this.props.previewContent.tags}
                    notebookName={this.props.previewContent.notebook}
                    noteName={this.props.previewContent.note}
                    updateTags={this.props.updateTags}
                />
                <GoToNote
                    notebookName={this.props.previewContent.notebook}
                    noteName={this.props.previewContent.note}
                    goToRoute={this.props.goToRoute}
                    lastOpenedNote={this.props.lastOpenedNote}
                />
                <PreviewViewer previewContent={this.props.previewContent} />
            </div>
        );
    }
}

export default PreviewNote;
