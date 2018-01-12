import * as React from 'react';
import { Link } from 'react-router-dom';

export interface Props {
    trash: object;
}

export interface State { }

export class TrashcanSidebar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        console.log(this.props);
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
                                    {notebook}
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
