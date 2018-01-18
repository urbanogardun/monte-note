import * as React from 'react';
import Sidebar from './Sidebar/index';
import MainSection from './MainSection/index';
import PreviewNote from './PreviewNote/index';
import ElectronMessager from '../../utils/electron-messaging/electronMessager';
import { GLOBAL_SEARCH } from '../../constants/index';

export interface Props {
    notebooks: string[];
    searchResults: object[];
    previewContent: object;
    updateTags: Function;
    updateSearchQuery: Function;
}
export interface State {
    searchQuery: string;
}

export class HomePage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            searchQuery: ''
        };
    }

    // Adds tag on Enter key press
    handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        let searchQuery = this.state.searchQuery;
        console.log('search for: ' + searchQuery);
        let data = {
            searchQuery: searchQuery
        };
        ElectronMessager.sendMessageWithIpcRenderer(GLOBAL_SEARCH, data);
    }

    updateInputValue(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({searchQuery: e.target.value});
    }

    render() {
        return (
            <div className="row">
                <Sidebar notebooks={this.props.notebooks} />
                <MainSection 
                    searchResults={this.props.searchResults} 
                    notebooks={this.props.notebooks}
                    updateSearchQuery={this.props.updateSearchQuery}
                />
                <PreviewNote 
                    previewContent={this.props.previewContent} 
                    updateTags={this.props.updateTags}
                />
            </div>
        );
    }
}

export default HomePage;
