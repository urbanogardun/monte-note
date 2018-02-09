import * as React from 'react';
import * as $ from 'jquery';
import ElectronMessager from '../../../../utils/electron-messaging/electronMessager';
import { GLOBAL_SEARCH, SEARCH_WITHIN_NOTEBOOK } from '../../../../constants/index';

export interface Props {
    allTags: string[];
    updateSelectedTags: Function;
    searchQuery: string;
    selectedNotebook: string;
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

    selectTag(event: React.MouseEvent<HTMLLIElement>, name: string) {
        
        let tags: string[] = [];
        
        if ( this.isTagSelected(event.target) ) {
            let tagToRemove = $(event.target).text();
            tags = this.state.selectedTags.filter((tag: string) => { return tag !== tagToRemove; });
            $(event.target).removeClass('tag-selected');
        } else {
            tags = this.state.selectedTags;
            tags.push(name);
            $(event.target).addClass('tag-selected');
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
        return (
                <React.Fragment>
                    {(this.props.allTags as string[]).map((name: string, index: number) => {
                        return (
                            <li 
                                key={name}
                                onClick={(e) => { this.selectTag(e, name); }} 
                                className={`sidebar-collapsed-item-text`}
                            >
                                {name}
                            </li>
                        );
                    })}
                </React.Fragment>
            );
    }
}

export default TagList;