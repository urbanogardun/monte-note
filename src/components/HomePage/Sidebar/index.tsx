import * as React from 'react';
import { Link } from 'react-router-dom';
// import NewNotebookButton from './NewNotebookButton';

export interface Props {
    notebooks: string[];
}

export class Sidebar extends React.Component<Props, {}> {
    render() {
        return (
            // <div className="col-sm-2">
            //     <NewNotebookButton />
            // </div> 
            <div className="col-2 trashcan sidebar">
                <section className="notebooks">
                    {/* <NewNotebookButton /> */}
                    <div 
                        className="notebook-name-sidebar" 
                        data-toggle="collapse" 
                        data-target="#collapseExample" 
                        aria-expanded="true"
                    >
                        Notebooks
                        <span className="oi oi-chevron-bottom expand-notebook" />
                        <span className="oi oi-chevron-left expand-notebook" />
                    </div>
                    <div className="collapse show notes-sidebar" id="collapseExample">
                        <ul className="list-group notes">
                            {(this.props.notebooks as string[]).map((name: string) => {
                                if (name !== '.trashcan') {
                                    return (
                                    <Link 
                                        to={`/notebooks/${name}`} 
                                        key={name}
                                    >
                                        <li className="list-group-item sidebar-note">{name}</li>
                                    </Link>
                                    );
                                } else {
                                    return;
                                }
                            })}
                        </ul>
                    </div>
                    <div 
                        className="notebook-name-sidebar" 
                        data-toggle="collapse" 
                        data-target="#collapseExample2" 
                        aria-expanded="false" 
                        title="Tags"
                    >
                        Tags
                        <span className="oi oi-chevron-bottom expand-notebook" />
                        <span className="oi oi-chevron-left expand-notebook" />
                    </div>
                    <div className="collapse notes-sidebar" id="collapseExample2">
                        <ul className="list-group notes">
                            <li className="list-group-item sidebar-note">Cras justo odio</li>
                            <li className="list-group-item sidebar-note">Dapibus ac facilisis in</li>
                            <li className="list-group-item sidebar-note">Morbi leo risus</li>
                            <li className="list-group-item sidebar-note">Porta ac consectetur ac</li>
                            <li className="list-group-item sidebar-note">Vestibulum at eros</li>
                        </ul>
                    </div>
                </section>

                <section className="trashcan">
                    <ul className="list-group notes">
                        <li 
                            className="list-group-item sidebar-note sidebar-link"
                        >Trash <span className="oi oi-trash trashcan" />
                        </li>
                    </ul>
                </section>

            </div>

        );
    }
}

export default Sidebar;