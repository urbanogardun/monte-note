import * as React from 'react';

export class LoadMoreButton extends React.Component<{}, {}> {

    render() {
        return (
            <div className="load-more">
                <button 
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