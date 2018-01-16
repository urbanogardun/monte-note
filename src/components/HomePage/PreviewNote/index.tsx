import * as React from 'react';
import PreviewViewer from './PreviewViewer/index';

export interface Props {}

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
                <PreviewViewer />
            </div>
        );
    }
}

export default PreviewNote;
