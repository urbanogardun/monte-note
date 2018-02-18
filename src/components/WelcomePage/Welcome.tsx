import * as React from 'react';
import ElectronMessager from '../../utils/electron-messaging/electronMessager';
var loader = require('../../assets/loader.svg');

export interface Props {
    name?: string;
    notebooksLocation?: string;
}

class Welcome extends React.Component<Props, object> {
    
    chooseNotebooksLocation(): void {
        ElectronMessager.chooseLocationForNotebooks();
        $('img.loader').show();
    }

    componentWillReceiveProps() {
        $('img.loader').hide();
    }

    render() {
        return (
            <React.Fragment>
                <div className="container-fluid welcome-screen">
                    <div className="row align-items-center welcome-row">
                        <div className="col montenote-welcome">
                            <h1 className="display-4">Welcome!</h1>
                            <p className="lead">
                                To begin using MonteNote, please select a directory
                                in which you want your note content to be saved. If you
                                would like to import notebooks you already have, just
                                select the directory that has them and MonteNote will import
                                them for you.
                        </p>
                            <button 
                                type="button" 
                                className="btn btn-primary select-notebooks-directory"
                                onClick={() => { this.chooseNotebooksLocation(); }}
                            >
                            Primary
                            </button>
                        </div>
                    </div>
                </div>
                <img className="loader" src={loader} alt="Loader" />
            </React.Fragment>

            // <div className="welcome">
            //     <h1>Welcome</h1>
            //     <button
            //         className="btn btn-primary btn-lg"
            //         onClick={() => { this.chooseNotebooksLocation(); }}
            //     >
            //         Click Me
            //     </button>
            // </div>
        );
    }
}

export default Welcome;