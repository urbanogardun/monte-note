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

    markNoteActive(e: any, sidebar?: string) {
        $('.sidebar-note').removeClass('notebook-name-sidebar-active');
        $('.currently-opened-note-sidebar-sm').removeClass('currently-opened-note-sidebar-sm');
        $('.currently-opened-note-sidebar-md').removeClass('currently-opened-note-sidebar-md');
        if (sidebar === 'sm') {
            let tagName = $(e.target).prop('tagName').toLowerCase();
            if (tagName === 'p') {
                $(e.target).children().addClass('currently-opened-note-sidebar-sm');
            } else {
                $(e.target).addClass('currently-opened-note-sidebar-sm');
            }
        } else if (sidebar === 'md') {
            $(e.target).addClass('currently-opened-note-sidebar-md');
        } else {
            $(e.target).addClass('notebook-name-sidebar-active');
        }
    }

    componentDidMount() {
        $('.sidebar-notebooks-dropdown-sm')
        .add('.sidebar-notebooks-dropdown-md')
        .add('.sidebar-tags-dropdown-sm')
        .add('.sidebar-tags-dropdown')
        .add('.new-notebook-container-sm').on('click', function() {
            if ($(this).hasClass('sidebar-notebooks-dropdown-md')) {
                ($('#collapseNotebooksBigSidebar') as any).collapse('toggle')
            } else if ($(this).hasClass('new-notebook-container-sm')) {
                $('.tag-links-sm').hide();
                $('.sidebar-notebook-links-sm').hide();

                $('.new-notebook-sm').css('display') === 'block' ? 
                $('.new-notebook-sm').hide() :
                $('.new-notebook-sm').show();
                $('input.sidebar-md').focus();
            } else if ($(this).hasClass('sidebar-tags-dropdown-sm')) {
                $('.sidebar-notebook-links-sm').hide();
                $('.new-notebook-sm').hide();

                $('.tag-links-sm').css('display') === 'block' ? 
                $('.tag-links-sm').hide() :
                $('.tag-links-sm').show();
            } else if ($(this).hasClass('sidebar-notebooks-dropdown-sm')) {
                $('.tag-links-sm').hide();
                $('.new-notebook-sm').hide();

                $('.sidebar-notebook-links-sm').css('display') === 'block' ? 
                $('.sidebar-notebook-links-sm').hide() :
                $('.sidebar-notebook-links-sm').show();
            } else if ($(this).hasClass('sidebar-tags-dropdown')) {
                ($('#collapseTagsBigSidebar') as any).collapse('toggle');
            }
        });
    }

    render() {
        return (

            <React.Fragment>
            
                {/* <!-- Sidebar --> */}

                <div className="col-2 sidebar-container col-1-sidebar-container-sm">
                    <div className="sidebar">
                        <div className="sidebar-item sidebar-item-md">
                            <div className="sidebar-item-text-container">
                                <Link
                                    to={'/'}
                                    title="Home"
                                    className="sidebar-item-text"
                                >
                                <p className="link-sidebar-lg">
                                    Home <span className="sidebar-item-icon oi oi-home"/>
                                </p>
                                </Link>
                            </div>
                        </div>

                        <div className="sidebar-item sidebar-item-sm">
                            <div className="sidebar-item-text-container sidebar-item-text-container-sm">
                                <Link
                                    to={'/'}
                                    title="Home"
                                >
                                    <span className="sidebar-item-icon sidebar-item-icon-sm oi oi-home" />
                                </Link>
                            </div>
                        </div>

                        {/* <!-- Notebooks Dropdown --> */}
                        <div className="sidebar-item sidebar-item-sm">
                            <div className="sidebar-item-text-container sidebar-notebooks-dropdown sidebar-notebooks-dropdown-sm sidebar-item-text-container-sm">
                                <a 
                                    className="sidebar-item-text" 
                                    title="Notes" 
                                    href="#collapseNotebooksSmallSidebar" 
                                    data-toggle="collapse" 
                                    aria-expanded="false" 
                                    aria-controls="collapseNotebooksSmallSidebar"
                                >
                                    <span className="sidebar-item-icon sidebar-item-icon-sm oi oi-layers"/>
                                </a>
                            </div>
                        </div>

                        <div className="sidebar-item">

                            <div 
                                className="sidebar-item-text-container sidebar-notebooks-dropdown sidebar-notebooks-dropdown-md sidebar-item-text-container-md"
                            />

                            <div className="sidebar-collapse-content collapse" id="collapseNotebooksBigSidebar">
                                <ul className="sidebar-collapsed-content list-unstyled"/>
                            </div>
                        </div>
                        {/* <!-- /Notebooks Dropdown --> */}
                    </div>
                </div>

                {/* <!-- Sidebar Extension for Medium & Small Devices --> */}
                <div className="col-2 sidebar-extension-sm sidebar-notebook-links-sm">
                    <div className="sidebar-collapse-content">

                        {(Object.keys(this.props.trash).map((notebook: string) => {
                            if (this.props.trash[notebook].length > 0) {
                                let notebookNameForId = notebook.split(' ').join('-');
                                let notebookNameTrimmed = notebook.length > 25 ? notebook.slice(0, 23) + '...' : notebook;
                                return (
                                    <React.Fragment>
                                    <a
                                        title={notebook} 
                                        className="nav-link trash-notebook-sidebar-md" 
                                        data-toggle="collapse" 
                                        href={`#${notebookNameForId}`} 
                                        role="button" 
                                        aria-expanded="false" 
                                        aria-controls={notebookNameForId}
                                    >
                                        {notebookNameTrimmed}
                                    </a>
                                    <div className="collapse" id={notebookNameForId}>
                                        <ul className="sidebar-collapsed-content list-unstyled">
                                            {(this.props.trash[notebook].map((note: string, index: number) => {
                                                return (
                                                    <p
                                                        key={note + index}
                                                        className={`list-group-item list-group-item-tag sidebar-collapsed-item-text notes-sidebar-md`}
                                                        onClick={(e) => {
                                                            this.getNoteFromTrash(notebook, note);
                                                            this.markNoteActive(e, 'md');
                                                        }}
                                                    >
                                                        {note}
                                                    </p>
                                                );
                                            }))}
                                        </ul>
                                    </div>
                                    </React.Fragment>
                                    // <div key={notebook} className="sidebar-collapse-content">
                                    //     <a
                                    //         className="nav-link dropdown-toggle"
                                    //         href="#"
                                    //         id={notebook}
                                    //         data-toggle="dropdown"
                                    //         aria-haspopup="true"
                                    //         aria-expanded="false"
                                    //     >
                                    //         {notebook}
                                    //     </a>
                                    //     <div className="sidebar-collapse-content collapse" id={notebook}>
                                    //         <ul className="sidebar-collapsed-content list-unstyled">
                                    //             {(this.props.trash[notebook].map((note: string, index: number) => {
                                    //                 return (
                                    //                     <p
                                    //                         key={note + index}
                                    //                         className={`list-group-item list-group-item-tag sidebar-collapsed-item-text notes-sidebar-md`}
                                    //                         onClick={(e) => {
                                    //                             this.getNoteFromTrash(notebook, note);
                                    //                             this.markNoteActive(e, 'sm');
                                    //                         }}
                                    //                     >
                                    //                         <span>{note}</span>
                                    //                     </p>
                                    //                 );
                                    //             }))}
                                    //         </ul>
                                    //     </div>
                                    // </div>
                                );
                            } else {
                                return;
                            }
                        }))}

                    </div>
                </div>

                {/* <!-- Add Note Extension --> */}
                <div className="col-2 sidebar-extension-sm sidebar-links-sm new-notebook-sm">
                    <div className="sidebar-collapse-content new-notebook-sidebar-md">
                        <div className={`sidebar-app-form input-group input-group-sm visible`}/>
                    </div>
                </div>
                {/* <!-- /Add Note Extension --> */}

                {/* <!-- /Sidebar Extension for Medium & Small Devices --> */}

                {/* <!-- Navbar for Smallest Devices --> */}
                <div className="col-12 navbar-sm-container">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-fixed-top">
                        <a className="navbar-brand" href="#">Logo</a>
                        <button 
                            className="navbar-toggler" 
                            type="button" 
                            data-toggle="collapse" 
                            data-target="#navbarNavDropdown" 
                            aria-controls="navbarNavDropdown"
                            aria-expanded="false" 
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"/>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavDropdown">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link
                                        to={'/'}
                                        className="hamburger-menu-link"
                                    >
                                        <p
                                            className="nav-link"
                                        >Home
                                        </p>
                                    </Link>
                                </li>


                                {(Object.keys(this.props.trash).map((notebook: string) => {
                                    if (this.props.trash[notebook].length > 0) {
                                        // let notebookNameForId = notebook.split(' ').join('-');
                                        // let notebookNameTrimmed = notebook.length > 25 ? notebook.slice(0, 23) + '...' : notebook;
                                        return (
                                            <li 
                                            key={notebook}
                                            className="nav-item dropdown">
                                                <a 
                                                    className="nav-link dropdown-toggle" 
                                                    href="#" 
                                                    id={notebook}
                                                    data-toggle="dropdown" 
                                                    aria-haspopup="true" 
                                                    aria-expanded="false"
                                                >
                                                    {notebook}
                                                </a>
                                                <div className="dropdown-menu" aria-labelledby="navbarDropdownNotesLink">
                                                    <ul className="sidebar-collapsed-content list-unstyled">
                                                        {(this.props.trash[notebook].map((note: string, index: number) => {
                                                            return (
                                                                <p
                                                                    key={note + index}
                                                                    className={`hamburger-menu-tag-element dropdown-item`}
                                                                    onClick={(e) => {
                                                                        this.getNoteFromTrash(notebook, note);
                                                                        this.markNoteActive(e, 'sm');
                                                                    }}
                                                                >
                                                                    <span>{note}</span>
                                                                </p>
                                                            );
                                                        }))}
                                                    </ul>
                                                </div>
                                            </li>
                                        );
                                    } else {
                                        return;
                                    }
                                }))}
                            </ul>
                        </div>
                    </nav>
                </div>
                {/* <!-- /Navbar for Smallest Devices --> */}
            
            </React.Fragment>


            // <div className="col-2 trashcan sidebar">
            //     <Link className="home-sidebar" to="/">
            //         <div className="notebook-name-sidebar" id="home-sidebar">
            //             Home
            //         </div>
            //     </Link>

            //     <section className="notebooks">

            //         {(Object.keys(this.props.trash).map((notebook: string) => {
            //             if (this.props.trash[notebook].length > 0) {
            //                 let notebookNameForId = notebook.split(' ').join('-');
            //                 let notebookNameTrimmed = notebook.length > 25 ? notebook.slice(0, 23) + '...' : notebook;
            //                 return (
            //                     <div key={notebook}>
            //                         <div
            //                             className="notebook-name-sidebar"
            //                             data-toggle="collapse"
                                   
            //                             data-target={`#${notebookNameForId}`}
            //                             aria-expanded="false"
            //                         >
            //                             {notebookNameTrimmed}
            //                             <span className="oi oi-chevron-bottom expand-notebook" />
            //                             <span className="oi oi-chevron-left expand-notebook" />
            //                         </div>
            //                         <div className="collapse notes-sidebar" id={notebookNameForId}>
            //                             <ul className="list-group notes">
            //                                 {(this.props.trash[notebook].map((note: string) => {
            //                                     return (
            //                                         <li 
            //                                             key={note} 
            //                                             className="list-group-item sidebar-note home-link"
            //                                             onClick={(e) => { 
            //                                                 this.getNoteFromTrash(notebook, note); 
            //                                                 this.markNoteActive(e);
            //                                             }}
            //                                         >
            //                                         {note}
            //                                         </li>
            //                                     );
            //                                 }))}
            //                             </ul>
            //                         </div>
            //                     </div>
            //                 );
            //             } else {
            //                 return;
            //             }
            //         }))}
            //     </section>
            // </div>
        );
    }
}

export default TrashcanSidebar;
