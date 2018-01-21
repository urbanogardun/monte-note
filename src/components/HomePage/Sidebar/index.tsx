import * as React from 'react';
import { Link } from 'react-router-dom';
import { ElectronMessager } from '../../../utils/electron-messaging/electronMessager';
import { GET_NOTEBOOKS } from '../../../constants/index';
import NewNotebookButton from './NewNotebookButton';
import TagList from './TagList/index';

export interface Props {
    notebooks: string[];
    goToRoute: Function;
    allTags: string[];
    updateSelectedTags: Function;
    searchQuery: string;
}

export class Sidebar extends React.Component<Props, {}> {

    componentWillMount() {
        ElectronMessager.sendMessageWithIpcRenderer(GET_NOTEBOOKS);
    }

    render() {
        return (
            <div className="col-2 trashcan sidebar">
                <section className="notebooks">
                    <section className="trashcan">
                        <ul className="list-group notes">
                            <NewNotebookButton 
                                goToRoute={this.props.goToRoute} 
                                notebooks={this.props.notebooks} 
                            />
                        </ul>
                    </section>

                    <div 
                        className="notebook-name-sidebar" 
                        data-toggle="collapse" 
                        data-target="#collapseExample" 
                        aria-expanded="false"
                    >
                        Notebooks
                        <span className="oi oi-chevron-bottom expand-notebook" />
                        <span className="oi oi-chevron-left expand-notebook" />
                    </div>
                    <div className="collapse notes-sidebar" id="collapseExample">
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
                    <TagList 
                        allTags={this.props.allTags} 
                        updateSelectedTags={this.props.updateSelectedTags}
                        searchQuery={this.props.searchQuery}
                    />
                </section>

                <section className="trashcan">
                    <ul className="list-group notes">
                        <Link 
                            to={'/trashcan'} 
                        >
                            <li 
                                className="list-group-item sidebar-note sidebar-link"
                            >Trash <span className="oi oi-trash trashcan" />
                            </li>
                        </Link>
                    </ul>
                </section>

            </div>
        );
    }
}

export default Sidebar;