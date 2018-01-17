import * as React from 'react';
import PreviewViewer from './PreviewViewer/index';
import TagList from './TagList/index';

export interface Props {
    previewContent: any;
}

export interface State {}

export class PreviewNote extends React.Component<Props, State> {

    render() {
        return (
            <div className="col preview-note-content">
                <div className="input-group input-group-sm mb-3">
                    <input 
                        type="text" 
                        className="form-control" 
                        aria-label="Small" 
                        aria-describedby="inputGroup-sizing-sm" 
                        placeholder="Add a tag..."
                    />
                </div>
                <TagList 
                    tags={this.props.previewContent.tags}
                    notebookName={this.props.previewContent.notebook}
                    noteName={this.props.previewContent.note}
                    updateTags={() => {return; }} 
                />
                <PreviewViewer previewContent={this.props.previewContent} />
            </div>
        );
    }
}

export default PreviewNote;
