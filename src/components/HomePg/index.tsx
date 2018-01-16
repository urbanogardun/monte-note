import * as React from 'react';
import Sidebar from './Sidebar/index';
import MainSection from './MainSection/index';
import ElectronMessager from '../../utils/electron-messaging/electronMessager';
import { GLOBAL_SEARCH } from '../../constants/index';

export interface Props {}
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
        if (e.key === 'Enter') {
            let searchQuery = this.state.searchQuery;
            console.log('search for: ' + searchQuery);
            ElectronMessager.sendMessageWithIpcRenderer(GLOBAL_SEARCH, searchQuery);
        }
    }

    updateInputValue(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({searchQuery: e.target.value});
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="input-group input-group-sm mb-3 add-tags">
                        <input 
                            value={this.state.searchQuery}
                            onChange={e => this.updateInputValue(e)}
                            type="text"
                            className="form-control" 
                            aria-label="Small" 
                            placeholder="Search content" 
                            aria-describedby="inputGroup-sizing-sm"
                            onKeyPress={(e) => this.handleKeyPress(e)}
                        />
                    </div>
                </div>
                <div className="row">
                    <Sidebar />
                    <MainSection />
                    <div className="col-sm">
                        <h1>Preview Note Content</h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;
