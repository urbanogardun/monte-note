import * as React from 'react';
import SearchBar from './SearchBar/index';
import LoadMoreButton from './LoadMoreButton/index';
import { ElectronMessager } from '../../../utils/electron-messaging/electronMessager';
import { GET_NOTE_CONTENT, GLOBAL_SEARCH } from '../../../constants/index';

export interface Props {
    searchResults: object[];
    notebooks: string[];
    updateSearchQuery: Function;
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
    }

    handleScroll() {
        // We get 3rd page on start because on app initialization we get the
        // 1st page of results automatically, then on clicking the Load More 
        // button we get the 2nd page, and after that it's this function's turn.
        let searchPageToGet = 3;
        $('div.notes-index').on('scroll', function(this: any) {
            let scrollTop = $(this).scrollTop() as any;
            let innerHeight = $(this).innerHeight() as any;

            // Calculate to see if we have reached the bottom of the page & that button to load more
            // content is not there
            if ( (scrollTop + innerHeight >= $(this)[0].scrollHeight) && (!$('div.load-more').length) ) {
                let data = {
                    searchQuery: '',
                    searchPage: searchPageToGet,
                    searchResultsPerPage: 10
                };

                searchPageToGet = searchPageToGet + 1;
                ElectronMessager.sendMessageWithIpcRenderer(GLOBAL_SEARCH, data);
            }
        });
    }

    componentDidMount() {
        this.handleScroll();
    }

    render() {

        let loadMoreButton = ( <div /> );
        if ( (this.props.searchResults.length > 9) && (this.props.searchResults.length < 11) ) {
            loadMoreButton = <LoadMoreButton />;
        }

        return (
            <div className="col notes-index">
                <ul className="list-group">
                    <SearchBar 
                        notebooks={this.props.notebooks} 
                        updateSearchQuery={this.props.updateSearchQuery}
                    />

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