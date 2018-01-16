import * as React from 'react';
import NotebooksList from './NotebooksList/index';

export class MainSection extends React.Component {
    render() {
        return (
            <div className="col-sm-2">
                <NotebooksList />
            </div>
        );
    }
}

export default MainSection;