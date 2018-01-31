import * as React from 'react';
import { Link } from 'react-router-dom';
import electronMessager from '../../../utils/electron-messaging/electronMessager';
import { GET_NOTE_FROM_TRASH } from '../../../constants/index';

export interface Props {
    trash: object;
}

export interface State { }

export class TrashcanSidebar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    getNoteFromTrash(notebook: string, note: string) {
        let data = {
            notebook: notebook,
            note: note
        };
        electronMessager.sendMessageWithIpcRenderer(GET_NOTE_FROM_TRASH, data);
    }

    render() {
        return (
            <div className="col-2 trashcan sidebar">
                <Link className="home-sidebar" to="/">
                    <div className="notebook-name-sidebar" id="home-sidebar">
                        Home
                    </div>
                </Link>

                <section className="notebooks">

                    {(Object.keys(this.props.trash).map((notebook: string) => {
                        return (
                            <div key={notebook}>
                                <div
                                    className="notebook-name-sidebar"
                                    data-toggle="collapse"
                               
                                    data-target={`#${notebook}`}
                                    aria-expanded="false"
                                >
                                    {
                                        notebook.length > 25 ? 
                                        notebook.slice(0, 23) + '...' : 
                                        notebook
                                    }
                                    <span className="oi oi-chevron-bottom expand-notebook" />
                                    <span className="oi oi-chevron-left expand-notebook" />
                                </div>
                                <div className="collapse notes-sidebar" id={notebook}>
                                    <ul className="list-group notes">
                                        {(this.props.trash[notebook].map((note: string) => {
                                            return (
                                                <li 
                                                    key={note} 
                                                    className="list-group-item sidebar-note"
                                                    onClick={() => { this.getNoteFromTrash(notebook, note); }}
                                                >
                                                {note}
                                                </li>
                                            );
                                        }))}
                                    </ul>
                                </div>
                            </div>
                        );
                    }))}
                </section>
            </div>
        );
    }
}

export default TrashcanSidebar;
