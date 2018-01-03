import * as React from 'react';

export interface Props {
    location?: any;
}

export class Sidebar extends React.Component<Props, {}> {
    render() {
        return (
            <div className="col-sm-2 sidebar">
                <h3>Notes List</h3>
            </div> 
        );
    }
}

export default Sidebar;