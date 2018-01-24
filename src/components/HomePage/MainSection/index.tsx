import * as React from 'react';
import SearchBar from './SearchBar/index';
import LoadMoreButton from './LoadMoreButton/index';
import { ElectronMessager } from '../../../utils/electron-messaging/electronMessager';
import { 
    GET_NOTE_CONTENT, 
    GLOBAL_SEARCH, 
    SEARCH_WITHIN_NOTEBOOK } from '../../../constants/index';
import * as $ from 'jquery';

export interface Props {
    searchResults: any;
    notebooks: string[];
    selectedTags: string[];
    updateSearchQuery: Function;
    updateSelectedNotebook: Function;
    updatePreview: Function;
    previewData: any;
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
        this.handleScroll = this.handleScroll.bind(this);

        $('div.card').removeClass('note-selected');
        // Highlight selected note
        $(`#${notebook}-${note}`).children().first().addClass('note-selected');
    }

    handleScroll() {
        // We get 3rd page on start because on app initialization we get the
        // 1st page of results automatically, then on clicking the Load More 
        // button we get the 2nd page, and after that it's this function's turn.
        let searchPageToGet = 3;
        let self = this;
        $('div.notes-index').on('scroll', function(this: any) {
            let scrollTop = $(this).scrollTop() as any;
            let innerHeight = $(this).innerHeight() as any;

            // Calculate to see if we have reached the bottom of the page & that button to load more
            // content is not there
            let searchQuery = self.props.searchResults.query;
            let notebook = self.props.searchResults.notebook;
            let selectedTags = self.props.selectedTags;
            if ( (scrollTop + innerHeight >= $(this)[0].scrollHeight) && (!$('div.load-more').length) ) {
                let data = {
                    searchQuery: searchQuery,
                    searchPage: searchPageToGet,
                    searchResultsPerPage: 10,
                    notebook: notebook,
                    appendSearchResults: true,
                    selectedTags: selectedTags
                };

                searchPageToGet = searchPageToGet + 1;
                if (notebook) {
                    ElectronMessager.sendMessageWithIpcRenderer(SEARCH_WITHIN_NOTEBOOK, data);
                } else {
                    ElectronMessager.sendMessageWithIpcRenderer(GLOBAL_SEARCH, data);
                }
            }
        });
    }

    componentDidMount() {
        this.handleScroll();
    }

    componentWillMount() {
        // ElectronMessager.sendMessageWithIpcRenderer(RELOAD_SEARCH_RESULTS);
    }

    componentWillReceiveProps(nextProps: Props) {
        // console.log(this.props);
    }

    render() {

        let loadMoreButton = ( <div /> );
        if ( (this.props.searchResults.results.length > 9) && (this.props.searchResults.results.length < 11) ) {
            loadMoreButton = 
            ( 
                <LoadMoreButton 
                    searchQuery={this.props.searchResults.query} 
                    notebook={this.props.searchResults.notebook}
                    selectedTags={this.props.selectedTags}
                />
            );
        }

        return (
            <div className="col notes-index">
                <ul className="list-group">
                    <SearchBar 
                        notebooks={this.props.notebooks} 
                        selectedTags={this.props.selectedTags}
                        updateSearchQuery={this.props.updateSearchQuery}
                        updateSelectedNotebook={this.props.updateSelectedNotebook}
                    />

                    {(this.props.searchResults.results as object[]).map((result: any) => {

                        let highlightElement = '';
                        if ( (this.props.previewData.note === result.noteName) 
                        && (this.props.previewData.notebook === result.notebookName) ) {
                            highlightElement = 'highlight-note-card';
                        }

                        return (
                            <li 
                                key={result._id} 
                                id={`${result.notebookName}-${result.noteName}`}
                                className={`list-group-item note-item ${highlightElement}`} 
                                onClick={

                                    (e) => { 
                                        this.props.updatePreview(result.notebookName, result.noteName);
                                        this.previewNote(result.notebookName, result.noteName); 
                                    }
                                }
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