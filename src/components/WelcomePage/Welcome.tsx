import * as React from 'react';
import ElectronMessager from '../../utils/electron-messaging/electronMessager';

export interface Props {
    name?: string;
    notebooksLocation?: string;
}

class Welcome extends React.Component<Props, object> {
    
    componentDidMount() {
        console.log(this.props);
    }

    chooseNotebooksLocation(): void {
        ElectronMessager.chooseLocationForNotebooks();
    }

    render() {
        return (
            <div className="welcome">
                <h1>Welcome</h1>
                <button
                    className="btn btn-primary btn-lg"
                    onClick={() => { this.chooseNotebooksLocation(); }}
                >
                    Click Me
                </button>
            </div>
        );
    }
}

export default Welcome;