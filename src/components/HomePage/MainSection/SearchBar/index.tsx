import * as React from 'react';
import { ElectronMessager } from '../../../../utils/electron-messaging/electronMessager';
import { GLOBAL_SEARCH, SEARCH_WITHIN_NOTEBOOK } from '../../../../constants/index';
import * as $ from 'jquery';

export interface Props {
    notebooks: string[];
}

export interface State {
    searchQuery: string;
    searchOption: string;
    notebookToSearch: string;
}

export class SearchBar extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            searchQuery: '',
            searchOption: GLOBAL_SEARCH,
            notebookToSearch: ''
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
        if (this.state.searchOption === GLOBAL_SEARCH) {
            let searchData = {
                searchQuery: searchQuery
            };
            ElectronMessager.sendMessageWithIpcRenderer(GLOBAL_SEARCH, searchData);
        } else {
            let searchData = {
                notebook: this.state.notebookToSearch,
                searchQuery: searchQuery
            };
            ElectronMessager.sendMessageWithIpcRenderer(SEARCH_WITHIN_NOTEBOOK, searchData);
        }
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
        let notebookName = $(e.target).text().trim();
        
        // Set check icon to currently selected search option
        $('span.notebook-check').hide();
        $(e.target).html(`<span class="oi oi-check notebook-check"></span> ${notebookName}`);

        // Set search option depending on what got selected
        if (notebookName === 'All Notebooks') {
            this.setState({searchOption: GLOBAL_SEARCH});
        } else {
            this.setState({
                searchOption: SEARCH_WITHIN_NOTEBOOK,
                notebookToSearch: notebookName
            });
        }
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
                                <a 
                                    className="dropdown-item" 
                                    href="#" 
                                    onClick={(e) => {
                                        this.updateSearchValue(e);
                                        this.runSearch();
                                    }}
                                >
                                    <span className="oi oi-check notebook-check" /> All Notebooks
                                </a>
                                <div role="separator" className="dropdown-divider" />

                                {(this.props.notebooks as string[]).map((name: string) => {
                                    if (name !== '.trashcan') {
                                        return (
                                            <a
                                                className="dropdown-item"
                                                onClick={(e) => {
                                                    this.updateSearchValue(e);
                                                    this.runSearch();
                                                }}
                                                href="#"
                                                key={name}
                                            >
                                                {name}
                                            </a>
                                        );
                                    } else {
                                        return;
                                    }
                                })}
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
