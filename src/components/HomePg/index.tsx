import * as React from 'react';
import Sidebar from './Sidebar/index';

export class HomePage extends React.Component {
    render() {
        return (
            <div className="row">
                <Sidebar />
                <div className="col-sm-4">
                    <h1>Main</h1>
                </div>
                <div className="col-sm">
                    <h1>Preview Note Content</h1>
                </div>
            </div>
        );
    }
}

export default HomePage;
