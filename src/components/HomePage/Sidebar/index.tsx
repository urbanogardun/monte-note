import * as React from 'react';
import { Link } from 'react-router-dom';
import { ElectronMessager } from '../../../utils/electron-messaging/electronMessager';
import { GET_NOTEBOOKS, TRASHCAN } from '../../../constants/index';
import NewNotebookButton from './NewNotebookButton';
import TagList from './TagList/index';
import { SearchBar } from '../MainSection/SearchBar/index';

export interface Props {
    notebooks: string[];
    goToRoute: Function;
    allTags: string[];
    updateSelectedTags: Function;
    searchQuery: string;
    selectedNotebook: string;
    selectedTags: string[];
    updateSearchQuery: Function;
    updateSelectedNotebook: Function;
}

export class Sidebar extends React.Component<Props, {}> {

    componentWillMount() {
        ElectronMessager.sendMessageWithIpcRenderer(GET_NOTEBOOKS);
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

        // Don't close tags dropdown in hamburger menu on tag click
        $('#navbarDropdownTagsLink').on('click', function(event: any) {
            event.preventDefault();
            $(window).scrollTop(0);
            $(this).attr('aria-expanded', 'true');
            $('.tags-dropdown-hamburger-container').toggleClass('show');
        });

        // Always scroll to top on any hamburger menu link that opens a dropdown.
        // This is to prevent navbar jumping out of our window view due to
        // CSS settings that keep it stickied.
        $('#navbarDropdownNotebooksLink').on('click', function(event: any) {
            event.preventDefault();
            $(window).scrollTop(0);
        });

        $('button.navbar-toggler').on('click', function(event: any) {
            $('#navbarDropdownTagsLink').attr('aria-expanded', 'false');
            $('.tags-dropdown-hamburger-container').removeClass('show');
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
                                <NewNotebookButton
                                    goToRoute={this.props.goToRoute}
                                    notebooks={this.props.notebooks}
                                />
                            </div>
                        </div>

                        <div className="sidebar-item sidebar-item-sm">
                            <div 
                                className="sidebar-item-text-container sidebar-item-text-container-sm new-notebook-container-sm"
                            >
                                <a 
                                    href="#newNotebook" 
                                    title="New Notebook" 
                                    className="sidebar-item-text"
                                ><span className="sidebar-item-icon sidebar-item-icon-sm oi oi-book"/>
                                </a>
                            </div>
                        </div>
        
                        {/* <!-- Notebooks Dropdown --> */}
                        <div className="sidebar-item sidebar-item-sm">
                            <div className="sidebar-item-text-container sidebar-notebooks-dropdown sidebar-notebooks-dropdown-sm sidebar-item-text-container-sm">
                                <a 
                                    className="sidebar-item-text" 
                                    title="Notebooks" 
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

                            <div className="sidebar-item-text-container sidebar-notebooks-dropdown sidebar-notebooks-dropdown-md sidebar-item-text-container-md">
                                <a 
                                    className="sidebar-item-text" 
                                    href="#collapseNotebooksBigSidebar" 
                                    data-toggle="collapse" 
                                    aria-expanded="false" 
                                    aria-controls="collapseNotebooksBigSidebar"
                                >Notebooks
                                <span className="sidebar-item-icon oi oi-chevron-left"/>
                                <span className="sidebar-item-icon oi oi-chevron-bottom"/>
                                </a>
                            </div>
                        
                            <div className="sidebar-collapse-content collapse" id="collapseNotebooksBigSidebar">
                                <ul className="sidebar-collapsed-content list-unstyled">
                                    {(this.props.notebooks as string[]).map((name: string) => {
                                        if (name !== TRASHCAN) {
                                            return (
                                                <Link
                                                        to={`/notebooks/${name}`}
                                                        key={name}
                                                        className="sidebar-item-link"
                                                >
                                                    <li className="list-group-item list-group-item-tag sidebar-collapsed-item-text">
                                                            {name}
                                                    </li>
                                                </Link>
                                            );
                                        } else {
                                            return;
                                        }
                                    })}
                                </ul>
                            </div>
                        </div>
                        {/* <!-- /Notebooks Dropdown --> */}
        
                        {/* <!-- /Tags Dropdown --> */}
                        <div className="sidebar-item sidebar-item-sm">
                            <div className="sidebar-item-text-container sidebar-tags-dropdown-sm sidebar-item-text-container-sm">
                                <a 
                                    className="sidebar-item-text" 
                                    title="Tags" 
                                    href="#collapseTagsSmallSidebar"
                                >
                                    <span className="sidebar-item-icon sidebar-item-icon-sm oi oi-tags"/>
                                </a>
                            </div>
                        </div>
                        <div className="sidebar-item">

                            <div className="sidebar-item-text-container sidebar-item-text-container-md sidebar-tags-dropdown">
                                <a 
                                    className="sidebar-item-text" 
                                    href="#collapseTagsBigSidebar" 
                                    data-toggle="collapse" 
                                    aria-expanded="false"
                                    aria-controls="collapseTagsBigSidebar"
                                >Tags
                                <span className="sidebar-item-icon oi oi-chevron-left"/>
                                <span className="sidebar-item-icon oi oi-chevron-bottom"/>
                                </a>
                            </div>
            
                            <div className="sidebar-collapse-content collapse" id="collapseTagsBigSidebar">
                                <ul className="sidebar-collapsed-content list-unstyled">
                                    <TagList
                                        allTags={this.props.allTags}
                                        updateSelectedTags={this.props.updateSelectedTags}
                                        searchQuery={this.props.searchQuery}
                                        selectedNotebook={this.props.selectedNotebook}
                                    />
                                </ul>
                            </div>
                        </div>
                        {/* <!-- /Tags Dropdown --> */}

                        {/* <!-- Trash --> */}
                        <div className="sidebar-item sidebar-item-md">
                            <div className="sidebar-item-text-container">
                                    <Link
                                        to={'/trashcan'}
                                        className="sidebar-item-text sidebar-link-lg"
                                        title="Trash"
                                    >
                                        Trash <span className="sidebar-item-icon oi oi-trash"/>
                                    </Link>
                            </div>
                        </div>
        
                        <div className="sidebar-item sidebar-item-sm">
                            <div className="sidebar-item-text-container sidebar-item-text-container-sm">
                                <Link
                                    to={'/trashcan'}
                                    className="sidebar-item-text sidebar-link-md"
                                    title="Trash"
                                >
                                    <span className="sidebar-item-icon sidebar-item-icon-sm oi oi-trash trashcan" />
                                </Link>
                            </div>
                        </div>
                        {/* <!-- /Trash --> */}
        
                    </div>
                </div>

                {/* <!-- Sidebar Extension for Medium & Small Devices --> */}
                <div className="col-2 sidebar-extension-sm sidebar-notebook-links-sm">
                    <div className="sidebar-collapse-content">
                        <ul className="sidebar-collapsed-content list-unstyled">
                            {(this.props.notebooks as string[]).map((name: string) => {
                                if (name !== TRASHCAN) {
                                    return (
                                        <Link
                                            to={`/notebooks/${name}`}
                                            key={name}
                                            className="sidebar-item-link"
                                        >
                                            <li className="list-group-item list-group-item-tag sidebar-collapsed-item-text">
                                                {name}
                                            </li>
                                        </Link>
                                    );
                                } else {
                                    return;
                                }
                            })}
                        </ul>
                    </div>
                </div>
                <div className="col-2 sidebar-extension-sm sidebar-links-sm tag-links-sm">
                    <div className="sidebar-collapse-content">
                        <ul className="sidebar-collapsed-content list-unstyled tag-list-sidebar-md">
                            <TagList
                                allTags={this.props.allTags}
                                updateSelectedTags={this.props.updateSelectedTags}
                                searchQuery={this.props.searchQuery}
                                selectedNotebook={this.props.selectedNotebook}
                            />
                        </ul>
                    </div>
                </div>

                {/* <!-- Add Notebook Extension --> */}
                <div className="col-2 sidebar-extension-sm sidebar-links-sm new-notebook-sm">
                    <div className="sidebar-collapse-content new-notebook-sidebar-md">
                        <NewNotebookButton
                            goToRoute={this.props.goToRoute}
                            notebooks={this.props.notebooks}
                            forMediumSidebar={true}
                        />
                    </div>
                </div>
                {/* <!-- /Add Notebook Extension --> */}

                {/* <!-- /Sidebar Extension for Medium & Small Devices --> */}

                {/* <!-- Navbar for Smallest Devices --> */}
                <div className="col-12 navbar-sm-container">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-fixed-top">
                        <a className="navbar-brand" href="#">Logo</a>
                        <SearchBar 
                            notebooks={this.props.notebooks} 
                            selectedTags={this.props.selectedTags}
                            updateSearchQuery={this.props.updateSearchQuery}
                            updateSelectedNotebook={this.props.updateSelectedNotebook}
                            forHamburgerMenu={true}
                        />
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
                                <NewNotebookButton
                                    goToRoute={this.props.goToRoute}
                                    notebooks={this.props.notebooks}
                                    forHamburgerMenu={true}
                                />
                                <li className="nav-item dropdown">
                                    <a 
                                        className="nav-link dropdown-toggle" 
                                        href="#" 
                                        id="navbarDropdownNotebooksLink" 
                                        data-toggle="dropdown" 
                                        aria-haspopup="true" 
                                        aria-expanded="false"
                                    >
                                        Notebooks
                                    </a>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdownNotebooksLink">
                                        <ul className="sidebar-collapsed-content list-unstyled">
                                            {(this.props.notebooks as string[]).map((name: string) => {
                                                if (name !== TRASHCAN) {
                                                    return (
                                                        <Link
                                                            to={`/notebooks/${name}`}
                                                            key={name}
                                                            className="dropdown-item"
                                                        >
                                                                {name}
                                                        </Link>
                                                    );
                                                } else {
                                                    return;
                                                }
                                            })}
                                        </ul>
                                    </div>
                                </li>
                                <li className="nav-item dropdown">
                                    <a 
                                        className="nav-link dropdown-toggle" 
                                        href="#" 
                                        id="navbarDropdownTagsLink" 
                                        aria-haspopup="true" 
                                        aria-expanded="false"
                                    >
                                        Tags
                                    </a>
                                    <div 
                                        className="dropdown-menu tags-dropdown-hamburger-container" 
                                        aria-labelledby="navbarDropdownTagsLink"
                                    >
                                        <TagList
                                            allTags={this.props.allTags}
                                            updateSelectedTags={this.props.updateSelectedTags}
                                            searchQuery={this.props.searchQuery}
                                            selectedNotebook={this.props.selectedNotebook}
                                            forHamburgerMenu={true}
                                        />
                                    </div>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to={'/trashcan'}
                                        className="hamburger-menu-link"
                                    >
                                        <p
                                            className="nav-link"
                                        >Trash
                                        </p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
                {/* <!-- /Navbar for Smallest Devices --> */}

                {/* <!-- /Sidebar --> */}
            </React.Fragment>
        );
    }
}

export default Sidebar;