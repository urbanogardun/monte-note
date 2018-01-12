import * as React from 'react';
import { Link } from 'react-router-dom';

export interface Props { }

export interface State { }

export class TrashcanSidebar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
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
                    <div 
                        className="notebook-name-sidebar"
                        data-toggle="collapse" 
                        data-target="#collapseExample" 
                        aria-expanded="false"
                    >
                        Chemistry Notes 
                        <span className="oi oi-chevron-bottom expand-notebook"/>
                        <span className="oi oi-chevron-left expand-notebook"/>
                    </div>
                    <div className="collapse notes-sidebar" id="collapseExample">
                        <ul className="list-group notes">
                            <li className="list-group-item sidebar-note">Cras justo odio</li>
                            <li className="list-group-item sidebar-note">Dapibus ac facilisis in</li>
                            <li className="list-group-item sidebar-note">Morbi leo risus</li>
                            <li className="list-group-item sidebar-note">Porta ac consectetur ac</li>
                            <li className="list-group-item sidebar-note">Vestibulum at eros</li>
                        </ul>
                    </div>
                    <div 
                        className="notebook-name-sidebar" 
                        data-toggle="collapse" 
                        data-target="#collapseExample2" 
                        aria-expanded="false"
                    >
                        Biology
                    <span className="oi oi-chevron-bottom expand-notebook"/>
                        <span className="oi oi-chevron-left expand-notebook"/>
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
            </div>
        );
    }
}

export default TrashcanSidebar;
