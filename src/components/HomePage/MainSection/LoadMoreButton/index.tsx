import * as React from 'react';
import ElectronMessager from '../../../../utils/electron-messaging/electronMessager';
import { GLOBAL_SEARCH, SEARCH_WITHIN_NOTEBOOK } from '../../../../constants/index';

export interface Props {
    searchQuery: string;
    notebook: string;
}

export class LoadMoreButton extends React.Component<Props, {}> {

    loadMoreResults(pageNumber: number, resultsPerPage: number) {
        let data = {
            searchQuery: this.props.searchQuery,
            searchPage: 2,
            searchResultsPerPage: 10,
            notebook: this.props.notebook,
            appendSearchResults: true
        };

        if (data.notebook) {
            ElectronMessager.sendMessageWithIpcRenderer(SEARCH_WITHIN_NOTEBOOK, data);
        } else {
            ElectronMessager.sendMessageWithIpcRenderer(GLOBAL_SEARCH, data);
        }

    }

    render() {
        return (
            <div className="load-more">
                <button 
                    onClick={() => this.loadMoreResults(2, 10)}
                    type="button" 
                    className="btn btn-primary"
                >
                    Load More
                </button>
            </div>
        );
    }
}

export default LoadMoreButton;