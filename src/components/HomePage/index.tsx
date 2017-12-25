import * as React from 'react';
import NewNotebookButton from './Sidebar/NewNotebook/index';

export class HomePage extends React.Component<{}, {}> {
    render() {
        return (
            <div className="row">
                <div className="col-sm-2">
                    <NewNotebookButton />
                </div>
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
