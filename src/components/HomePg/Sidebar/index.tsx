import * as React from 'react';
import NewNotebookButton from './NewNotebookButton';

export class Sidebar extends React.Component {
    render() {
        return (
            <div className="col-sm-2">
                <NewNotebookButton />
            </div> 
        );
    }
}

export default Sidebar;