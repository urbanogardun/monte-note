import * as React from 'react';
import { ElectronMessager } from '../../../../utils/electron-messaging/electronMessager';
import { GLOBAL_SEARCH } from '../../../../constants/index';

export interface Props {
    notebooks: string[];
}

export interface State {
    searchQuery: string;
}

export class SearchBar extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            searchQuery: ''
        };
        // Debounce calls to ElectronMessager for a number of msecs
        // this.debounce keeps a reference to the same debounceEvent function
        // so we don't create multiple same functions.
        this.debounce = debounceEvent(this.sendSearchQuery.bind(this), 250);
    }

    debounce() {
        // Stores reference to instantiated debounceEvent function
        // Since debounce function is stateful and React components are
        // as well, we need a way to instantiate only one debounce function
        // and keep a reference to it.
    }

    sendSearchQuery() {
        let searchQuery = this.state.searchQuery;
        ElectronMessager.sendMessageWithIpcRenderer(GLOBAL_SEARCH, searchQuery);
    }

    runSearch() {
        // Calls this.debounce which stores reference to debounceEvent function
        // that calls itself with callback of sendSearchQuery which ultimately
        // sends the search query
        this.debounce();
    }

    updateInputValue(e: React.ChangeEvent<HTMLInputElement>) {
        // Save input value
        this.setState({searchQuery: e.target.value});
    }

    updateSearchValue(e: React.MouseEvent<HTMLAnchorElement>) {
        let clickedElement = e.target as Element;
        let notebookName = clickedElement.innerHTML;
        clickedElement.innerHTML = `<span class="oi oi-check"></span> ${notebookName}`;
        console.log(notebookName);
        // let originalElement = document.querySelector('#Chemistry-101') as Element;
        // originalElement.innerHTML = `<span class="oi oi-check"></span> ${notebookName}`;
        // console.log(originalElement);
    }

    render() {
        return (
            <li className="list-group-item note-item search-home">
                <div className="input-group input-group-sm mb-3">
                    <div className="input-group input-group-sm mb-3 add-tags">
                        <input
                            value={this.state.searchQuery}
                            onChange={e => { 
                                this.updateInputValue(e);
                                this.runSearch();
                            }}
                            type="text"
                            className="form-control"
                            aria-label="Small"
                            placeholder="Search"
                            aria-describedby="inputGroup-sizing-sm"
                        />

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
                                <a 
                                    className="dropdown-item" 
                                    onClick={(e) => this.updateSearchValue(e)} 
                                    href="#"
                                >
                                    Chemistry 101
                                </a>
                                <a className="dropdown-item" href="#">Biology</a>
                                <a className="dropdown-item" href="#">Introduction to Advertising</a>
                            </div>
                        </div>

                    </div>
                </div>
            </li>
        );
    }
}

export default SearchBar;

// Helpers

function debounceEvent(callback: any, time: Number) {
    let interval: number | null;
    return (...args: any[]) => {
      clearTimeout(interval as number);
      interval = setTimeout(() => {
        interval = null;
        callback(...args);
      },                    time);
    };
  }
