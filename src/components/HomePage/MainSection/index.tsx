import * as React from 'react';
import SearchBar from './SearchBar/index';
// import LoadMoreButton from './LoadMoreButton/index';
import { ElectronMessager } from '../../../utils/electron-messaging/electronMessager';
import { 
    GET_NOTE_CONTENT, 
    GLOBAL_SEARCH, 
    SEARCH_WITHIN_NOTEBOOK } from '../../../constants/index';
import GoToNote from '../PreviewNote/GoToNote/index';
import * as $ from 'jquery';

export interface Props {
    searchResults: any;
    notebooks: string[];
    selectedTags: string[];
    updateSearchQuery: Function;
    updateSelectedNotebook: Function;
    updatePreview: Function;
    previewData: any;
    searchQuery: string;
    previewContent: any;
    goToRoute: Function;
    lastOpenedNote: string;
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
        $(`li[entryname="${notebook}-${note}"]`).children().addClass('note-selected');
    }

    handleScroll() {
        // We get 3rd page on start because on app initialization we get the
        // 1st page of results automatically, then on clicking the Load More 
        // button we get the 2nd page, and after that it's this function's turn.
        let searchPageToGet = 2;
        let self = this;
        let oldQuery = '';
        let selectedNotebook = '';
        $('div.notes-index').on('scroll', function(this: any) {
            let scrollTop = $(this).scrollTop() as any;
            let innerHeight = $(this).innerHeight() as any;

            // Calculate to see if we have reached the bottom of the page & that button to load more
            // content is not there
            let searchQuery = self.props.searchResults.query;
            let notebook = self.props.searchResults.notebook;
            let selectedTags = self.props.selectedTags;
            if (self.props.searchResults.results.length > 0) {
                if ( (scrollTop + innerHeight >= $(this)[0].scrollHeight) && (!$('div.load-more').length) ) {
                    let data = {
                        searchQuery: searchQuery,
                        searchPage: searchPageToGet,
                        searchResultsPerPage: 10,
                        notebook: notebook,
                        appendSearchResults: true,
                        selectedTags: selectedTags
                    };
    
                    // Whenever search query gets updated or another notebook gets
                    // selected for a search, reset the next search page to get
                    // back to 2.
                    if ((oldQuery.length === 0) && (searchQuery.length !== 0)) {
                        oldQuery = searchQuery;
                        searchPageToGet = 2;
                        data.searchPage = 2;
                    } else if ((oldQuery.length > 0) && (searchQuery.length === 0)) {
                        oldQuery = searchQuery;
                        searchPageToGet = 2;
                        data.searchPage = 2;
                    }
    
                    if ((selectedNotebook.length === 0) && (notebook)) {
                        selectedNotebook = notebook;
                        searchPageToGet = 2;
                        data.searchPage = 2;
                    } else if ((notebook) && (selectedNotebook !== notebook)) {
                        selectedNotebook = notebook;
                        searchPageToGet = 2;
                        data.searchPage = 2;
                    }
    
                    searchPageToGet = searchPageToGet + 1;
                    if (notebook) {
                        ElectronMessager.sendMessageWithIpcRenderer(SEARCH_WITHIN_NOTEBOOK, data);
                    } else {
                        ElectronMessager.sendMessageWithIpcRenderer(GLOBAL_SEARCH, data);
                    }
                }
            }
        });
    }

    componentDidMount() {
        this.handleScroll();
        if (this.props.previewData.notebook) {
            let data = {
                notebook: this.props.previewData.notebook,
                note: this.props.previewData.note,
                getContentForPreview: true
            };
            ElectronMessager.sendMessageWithIpcRenderer(GET_NOTE_CONTENT, data);
        }
    }

    componentWillMount() {
        // ElectronMessager.sendMessageWithIpcRenderer(RELOAD_SEARCH_RESULTS);
    }

    componentWillReceiveProps(nextProps: Props) {
        // console.log(this.props);
    }

    render() {

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

                        let noteContent = result.noteContent;
                        if ( (this.props.searchQuery.length > 0) && (noteContent) ) {
                            noteContent = highlightSearchQuery(result.noteContent, this.props.searchQuery);
                        } else {
                            noteContent = noteContent.length > 250 ? 
                            noteContent.substring(0, 250).trim() + '...' : noteContent;
                        }
                        
                        if (result.notebookName) {
                            return (
                                <li 
                                    key={result._id} 
                                    data-entryname={`${result.notebookName}-${result.noteName}`}
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
                                            <div 
                                                className="card-text" 
                                                dangerouslySetInnerHTML={{__html: noteContent}}
                                            />
                                            <div className="link-to-note">
                                                <GoToNote
                                                    notebookName={result.notebookName}
                                                    noteName={result.noteName}
                                                    goToRoute={this.props.goToRoute}
                                                    lastOpenedNote={this.props.lastOpenedNote}
                                                    forNotesList={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        } else {
                            return;
                        }
                    })}
                </ul>

                {/* {loadMoreButton} */}
            </div>
        );
    }
}

export default MainSection;

// helpers
function highlightSearchQuery(text: string, searchQuery: string) {
    let searchTerms = searchQuery.trim().split(' ').join('|');
  
    let regexp = new RegExp(searchTerms, 'ig');
    let newText = text.replace(regexp, `<span class="search-match">$&</span>`);

    let searchPosition = newText.indexOf(`<span class="search-match">`);
    if (searchPosition > -1) {

        if (text.length <= 250) {
            return newText;
        } else if (searchPosition >= (text.length - 250)) {
            // In cases where search gets matches with results at the end of the
            // note content. This will get text before and append to it 3 dots.
            let searchMatchAt = newText.indexOf(`<span class="search-match">`);
            return '...' + newText.substr(searchMatchAt - 250);
        } else {
            // When a match is somewhere in note content. We first get a substring
            // beginning from our first match inside a note. Then we add that
            // content as innerHTML inside a temporary div node. This will sanitize
            // that content so that we don't get fragments of HTML tags as text
            // inside a note preview results. After we get bare text content,
            // we cut that note content to a specified number of characters
            // and call replace function again to highlight relevant search
            // match(es).
            newText = newText.substr(searchPosition).trim();

            var temp = document.createElement('div');
            temp.innerHTML = newText.substr(newText.indexOf(`<span class="search-match">`)).trim();
            var sanitized = temp.textContent || temp.innerText;
            
            newText = sanitized.slice(0, 250) + '...';
            newText = newText.replace(regexp, `<span class="search-match">$&</span>`);
        }

        return newText;
    } else {
        return text = text.length > 250 ? text.substring(0, 250).trim() + '...' : text;
    }
    
}