import * as React from 'react';
// import ElectronMessager from '../../../../utils/electron-messaging/electronMessager';

export class LoadMoreButton extends React.Component<{}, {}> {

    loadMoreResults() {
        console.log('Load 10 more results');
        // ElectronMessager.sendMessageWithIpcRenderer();
    }

    render() {
        return (
            <div className="load-more">
                <button 
                    onClick={() => this.loadMoreResults()}
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