import * as React from 'react';
import SearchBar from './SearchBar/index';

export interface Props {
    searchResults: object[];
}

export class MainSection extends React.Component<Props, {}> {

    render() {
        console.log(this.props);
        return (
            <div className="col notes-index">
                <ul className="list-group">
                    <SearchBar />
                    <li className="list-group-item note-item">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Note Name</h5>
                                <h6 className="card-subtitle mb-2 notebook-name">
                                    <span className="oi oi-book"/> Notebook Name</h6>
                                <p className="card-text">Stripped text from HTML tags prev...</p>
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item note-item">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Chemistry Fundamentals</h5>
                                <h6 className="card-subtitle mb-2 notebook-name">
                                    <span className="oi oi-book"/> Chemistry 101</h6>
                                <p className="card-text">Chemistry is a science that involves...</p>
                            </div>
                        </div>
                    </li>
                </ul>

            </div>
        );
    }
}

export default MainSection;