import * as React from 'react';
import { ElectronMessager } from '../../../../utils/electron-messaging/electronMessager';
import { GLOBAL_SEARCH, SEARCH_WITHIN_NOTEBOOK, TRASHCAN } from '../../../../constants/index';
import * as $ from 'jquery';

export interface Props {
    notebooks: string[];
    selectedTags: string[];
    updateSearchQuery: Function;
    updateSelectedNotebook: Function;
    forHamburgerMenu?: boolean;
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
                searchQuery: searchQuery,
                selectedTags: this.props.selectedTags
            };
            ElectronMessager.sendMessageWithIpcRenderer(GLOBAL_SEARCH, searchData);
        } else {
            let searchData = {
                notebook: this.state.notebookToSearch,
                searchQuery: searchQuery,
                selectedTags: this.props.selectedTags
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
        // Save input 
        let self = this;
        this.setState({searchQuery: e.target.value}, function() {
            self.props.updateSearchQuery(self.state.searchQuery);
        });
    }

    updateSearchValue(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        let notebookName = $(e.target).text().trim();
        
        let isnotebookAlreadySelected = $(e.target).children().hasClass('notebook-check');

        if (!isnotebookAlreadySelected) {
            // Set check icon to currently selected search option
            $('span.notebook-check').remove();
            $(e.target).html(`<span class="oi oi-check notebook-check"></span> ${notebookName}`);
    
            // Set search option depending on what got selected
            if (notebookName === 'All Notebooks') {
                this.setState({searchOption: GLOBAL_SEARCH});

                this.props.updateSelectedNotebook('');
            } else {
                this.setState({
                    searchOption: SEARCH_WITHIN_NOTEBOOK,
                    notebookToSearch: notebookName
                });

                this.props.updateSelectedNotebook(notebookName);
            }

            this.runSearch();
        }
    }

    searchContent(e: React.MouseEvent<HTMLAnchorElement>) {
        this.selectNotebook(e.target);
        if (!this.isNotebookAlreadySelected(e.target)) {
            this.runSearch();
        }
    }

    isNotebookAlreadySelected(element: EventTarget) {
        if ($(element).children().hasClass('notebook-check')) {
            return true;
        } else {
            return false;
        }
    }

    selectNotebook(element: EventTarget) {
        let notebookName = $(element).text().trim();
        
        // Uncheck previously checked option
        $('span.notebook-check').remove();

        // Set check icon to currently selected search option
        $(element).html(`<span class="oi oi-check notebook-check"></span> ${notebookName}`);

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
        let forHamburgerMenu = '';
        let searchBar;
        if (this.props.forHamburgerMenu) {
            forHamburgerMenu = 'search-home-hamburger';
            searchBar = (

                <form className="form-inline search-sm">
                    <div className="input-group input-group-sm">
                        <input
                            value={this.state.searchQuery}
                            onChange={e => { 
                                this.updateInputValue(e);
                                // Don't run the search if user typed in a blank character
                                if (e.target.value[e.target.value.length - 1] !== ' ') {
                                    this.runSearch();
                                }
                            }}
                            type="text"
                            className="form-control search-notes"
                            aria-label="Small"
                            placeholder="Search"
                            aria-describedby="inputGroup-sizing-sm"
                        />
        
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary dropdown-toggle home-search search-filters"
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
                                    }}
                                >
                                    <span className="oi oi-check notebook-check" /> All Notebooks
                                </a>
                                <div role="separator" className="dropdown-divider" />
        
                                {(this.props.notebooks as string[]).map((name: string) => {
                                    if (name !== TRASHCAN) {
                                        return (
                                            <a
                                                className="dropdown-item"
                                                onClick={(e) => {
                                                    this.updateSearchValue(e);
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
                </form>
        
            );
        } else {
            searchBar = (
                <li className={`list-group-item note-item search-home ${forHamburgerMenu}`}>
                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group input-group-sm mb-3 add-tags">
                            <input
                                value={this.state.searchQuery}
                                onChange={e => { 
                                    this.updateInputValue(e);
                                    // Don't run the search if user typed in a blank character
                                    if (e.target.value[e.target.value.length - 1] !== ' ') {
                                        this.runSearch();
                                    }
                                }}
                                type="text"
                                className="form-control search-notes"
                                aria-label="Small"
                                placeholder="Search"
                                aria-describedby="inputGroup-sizing-sm"
                            />
    
                            <div className="input-group-append">
                                <button
                                    className="btn btn-outline-secondary dropdown-toggle home-search search-filters"
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
                                        }}
                                    >
                                        <span className="oi oi-check notebook-check" /> All Notebooks
                                    </a>
                                    <div role="separator" className="dropdown-divider" />
    
                                    {(this.props.notebooks as string[]).map((name: string) => {
                                        if (name !== TRASHCAN) {
                                            return (
                                                <a
                                                    className="dropdown-item"
                                                    onClick={(e) => {
                                                        this.updateSearchValue(e);
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
        return (
            searchBar
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
