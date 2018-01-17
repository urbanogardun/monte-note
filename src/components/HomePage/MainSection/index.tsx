import * as React from 'react';
import SearchBar from './SearchBar/index';
import LoadMoreButton from './LoadMoreButton/index';
import { ElectronMessager } from '../../../utils/electron-messaging/electronMessager';
import { GET_NOTE_CONTENT } from '../../../constants/index';

export interface Props {
    searchResults: object[];
    notebooks: string[];
}

export class MainSection extends React.Component<Props, {}> {

    previewNote(notebook: string, note: string) {
        // console.log(`Get note content for note: ${note} from notebook: ${notebook}`);
        let data = {
            notebook: notebook,
            note: note,
            getContentForPreview: true
        };
        ElectronMessager.sendMessageWithIpcRenderer(GET_NOTE_CONTENT, data);
    }

    render() {

        let loadMoreButton = ( <div /> );
        if (this.props.searchResults.length > 10) {
            loadMoreButton = <LoadMoreButton />;
        }

        return (
            <div className="col notes-index">
                <ul className="list-group">
                    <SearchBar notebooks={this.props.notebooks} />

                    {(this.props.searchResults as object[]).map((result: any) => {
                        return (
                            <li 
                                key={result._id} 
                                className="list-group-item note-item" 
                                onClick={(e) => this.previewNote(result.notebookName, result.noteName)}
                            >
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{result.noteName}</h5>
                                        <h6 className="card-subtitle mb-2 notebook-name">
                                            <span className="oi oi-book"/> {result.notebookName}</h6>
                                        <p className="card-text">{result.noteContent}</p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {loadMoreButton}
            </div>
        );
    }
}

export default MainSection;