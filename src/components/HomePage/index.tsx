import * as React from 'react';
import Sidebar from './Sidebar/index';
import MainSection from './MainSection/index';
import PreviewNote from './PreviewNote/index';
import ElectronMessager from '../../utils/electron-messaging/electronMessager';
import { GLOBAL_SEARCH } from '../../constants/index';

export interface Props {
    notebooks: string[];
    searchResults: object[];
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
        ElectronMessager.sendMessageWithIpcRenderer(GLOBAL_SEARCH, searchQuery);
    }

    updateInputValue(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({searchQuery: e.target.value});
    }

    render() {
        return (
            <div className="row">
                <Sidebar notebooks={this.props.notebooks} />
                <MainSection searchResults={this.props.searchResults} />
                <PreviewNote />
            </div>
        );
    }
}

export default HomePage;
