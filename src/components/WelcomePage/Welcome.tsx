import * as React from 'react';
import ElectronMessager from '../../utils/electron-messaging/electronMessager';

class Welcome extends React.Component {

    chooseNotebooksLocation(): void {
        ElectronMessager.chooseLocationForNotebooks();
    }
    
    render() {
        return(
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