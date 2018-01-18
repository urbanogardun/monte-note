import * as React from 'react';
import ElectronMessager from '../../../../utils/electron-messaging/electronMessager';
import { GLOBAL_SEARCH } from '../../../../constants/index';

export interface Props {
    searchQuery: string;
}

export class LoadMoreButton extends React.Component<Props, {}> {

    loadMoreResults(pageNumber: number, resultsPerPage: number) {
        console.log('Load 10 more results for query: ' + this.props.searchQuery);
        // TODO:
        // Pass searchQuery to this component
        let data = {
            searchQuery: this.props.searchQuery,
            searchPage: 2,
            searchResultsPerPage: 10 
        };
        ElectronMessager.sendMessageWithIpcRenderer(GLOBAL_SEARCH, data);
    }

    render() {
        return (
            <div className="load-more">
                <button 
                    onClick={() => this.loadMoreResults(2, 10)}
                    type="button" 
                    className="btn btn-primary"
                >
                    Primary
                </button>
            </div>
        );
    }
}

export default LoadMoreButton;