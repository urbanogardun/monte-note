import * as React from 'react';
import Sidebar from './Sidebar/index';
import MainSection from './MainSection/index';

export class HomePage extends React.Component {
    render() {
        return (
            <div className="row">
                <Sidebar />
                <MainSection />
                <div className="col-sm">
                    <h1>Preview Note Content</h1>
                </div>
            </div>
        );
    }
}

export default HomePage;
