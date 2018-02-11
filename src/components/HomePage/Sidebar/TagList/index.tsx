import * as React from 'react';
import * as $ from 'jquery';
import ElectronMessager from '../../../../utils/electron-messaging/electronMessager';
import { GLOBAL_SEARCH, SEARCH_WITHIN_NOTEBOOK } from '../../../../constants/index';

export interface Props {
    allTags: string[];
    updateSelectedTags: Function;
    searchQuery: string;
    selectedNotebook: string;
    forHamburgerMenu?: boolean;
}

export interface State {
    selectedTags: string[];
}

export class TagList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedTags: []
        };
    }

    selectTag(event: React.MouseEvent<HTMLLIElement | HTMLParagraphElement>, name: string) {
        
        let tags: string[] = [];
        
        if ( this.isTagSelected(event.target) ) {
            let tagToRemove = $(event.target).text().trim();
            tags = this.state.selectedTags.filter((tag: string) => { return tag !== tagToRemove; });

            $(`li.sidebar-collapsed-item-text:contains("${name}")`)
            .removeClass('tag-selected');
            
            $('.tags-dropdown-hamburger-container')
            .find(`p:contains("${tagToRemove}")`)
            .removeClass('tag-selected')
            .html(`${tagToRemove}`);
        } else {
            tags = this.state.selectedTags;
            tags.push(name);

            // Marks tag selected on all 3 sidebar versions so when user is
            // resizing the app selected tags will be tracked on each sidebar
            // version.
            $(`li.sidebar-collapsed-item-text:contains("${name}")`)
            .addClass('tag-selected');

            $('.tags-dropdown-hamburger-container')
            .find(`p:contains("${name}")`)
            .addClass('tag-selected')
            .html(`${name} <span class="oi oi-circle-check float-right"></span>`);
        }

        this.setState({
            selectedTags: tags
        });

        if (this.props.selectedNotebook) {
            let searchData = {
                notebook: this.props.selectedNotebook,
                searchQuery: this.props.searchQuery,
                selectedTags: tags
            };
            ElectronMessager.sendMessageWithIpcRenderer(SEARCH_WITHIN_NOTEBOOK, searchData);
        } else {
            let searchData = {
                searchQuery: this.props.searchQuery,
                selectedTags: tags
            };
            ElectronMessager.sendMessageWithIpcRenderer(GLOBAL_SEARCH, searchData);
        }

        this.props.updateSelectedTags(tags);
    }

    isTagSelected(element: any) {
        return $(element).hasClass('tag-selected');
    }

    render() {
        // let checkboxIcon = this.props.forHamburgerMenu ? (<span className="oi oi-circle-check float-right"/>) : '';
        let renderForHamburgerMenu = this.props.forHamburgerMenu;
        return (
                <React.Fragment>
                    {(this.props.allTags as string[]).map((name: string, index: number) => {
                        if (renderForHamburgerMenu) {
                            return (
                                <p
                                    key={name}
                                    onClick={(e) => { this.selectTag(e, name); }}
                                    className="hamburger-menu-tag-element dropdown-item" 
                                >
                                    {name}
                                </p>
                            );
                        } else {
                            return (
                                <li 
                                    key={name}
                                    onClick={(e) => { this.selectTag(e, name); }} 
                                    className={`list-group-item list-group-item-tag sidebar-collapsed-item-text`}
                                >
                                    {name}
                                </li>
                            );
                        }
                    })}
                </React.Fragment>
            );
    }
}

export default TagList;