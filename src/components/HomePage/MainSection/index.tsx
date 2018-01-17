import * as React from 'react';
import SearchBar from './SearchBar/index';

export interface Props {
    searchResults: object[];
    notebooks: string[];
    previewNote: Function;
}

export class MainSection extends React.Component<Props, {}> {

    render() {
        return (
            <div className="col notes-index">
                <ul className="list-group">
                    <SearchBar notebooks={this.props.notebooks} />

                    {(this.props.searchResults as object[]).map((result: any) => {
                        return (
                            <li 
                                key={result._id} 
                                className="list-group-item note-item" 
                                onClick={(e) => this.props.previewNote(result.notebookName, result.noteName)}
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
            </div>
        );
    }
}

export default MainSection;