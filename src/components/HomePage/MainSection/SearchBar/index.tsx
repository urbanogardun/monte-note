import * as React from 'react';
import { ElectronMessager } from '../../../../utils/electron-messaging/electronMessager';
import { GLOBAL_SEARCH } from '../../../../constants/index';

export interface Props {}

export interface State {
    searchQuery: string;
}

export class SearchBar extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            searchQuery: ''
        };
    }

    // Adds tag on Enter key press
    handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        let searchQuery = this.state.searchQuery;
        ElectronMessager.sendMessageWithIpcRenderer(GLOBAL_SEARCH, searchQuery);
    }

    updateInputValue(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({searchQuery: e.target.value});
    }

    render() {
        return (
            <li className="list-group-item note-item search-home">
                <div className="input-group input-group-sm mb-3">
                    <div className="input-group input-group-sm mb-3 add-tags">
                        <input
                            value={this.state.searchQuery}
                            onChange={e => this.updateInputValue(e)}
                            type="text"
                            className="form-control"
                            aria-label="Small"
                            placeholder="Search"
                            aria-describedby="inputGroup-sizing-sm"
                            onKeyPress={(e) => this.handleKeyPress(e)}
                        />
                    </div>
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary dropdown-toggle home-search"
                            type="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <span className="oi oi-chevron-bottom search-dropdown" />
                        </button>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="#"><span className="oi oi-check" /> All Notebooks</a>
                            <div role="separator" className="dropdown-divider" />
                            <a className="dropdown-item" href="#">Chemistry 101</a>
                            <a className="dropdown-item" href="#">Biology</a>
                            <a className="dropdown-item" href="#">Introduction to Advertising</a>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}

export default SearchBar;