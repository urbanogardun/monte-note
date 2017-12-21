import * as React from 'react';
import ElectronMessager from '../../../../utils/electron-messaging/electronMessager';

export class Modal extends React.Component<{}, {}> {

// notebookManager: NotebookManager;
electronMessager: ElectronMessager;

    componentDidMount() {
        // Read save directory from electron store config
        // this.notebookManager = new NotebookManager('random-directory');
    }

    addNotebook(name: string): boolean {
        // ipcRenderer.send('get-global-packages');
        ElectronMessager.isLocationForNotebooksSet();
        return true;
    }

    render() {
        return (
            <div>
                <div
                    className="modal fade"
                    id="exampleModal"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div
                        className="modal-dialog"
                        role="document"
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5
                                    className="modal-title"
                                    id="exampleModalLabel"
                                >
                                    Modal title
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label className="col-form-label notebook-name">Notebook Name:</label>
                                        <input type="text" className="form-control" id="recipient-name" />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => this.addNotebook('lalab')}
                                >
                                    Add Notebook
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;
