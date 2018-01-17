import * as React from 'react';
// import ElectronMessager from '../../../../utils/electron-messaging/electronMessager';
// import { GET_TAGS_FOR_NOTE, REMOVE_TAG_FROM_NOTE } from '../../../../constants/index';

export interface Props {
    tags: string[];
    notebookName: string;
    noteName: string;
    updateTags: Function;
}

export interface State {
    tag: string;
}

export class TagList extends React.Component<Props, State> {

    updateTags: boolean = true;

    constructor(props: Props) {
        super(props);
    }

    // removeTag(name: string) {
    //     let data = {
    //         notebook: this.props.notebookName,
    //         note: this.props.noteName,
    //         tag: name
    //     };
    //     ElectronMessager.sendMessageWithIpcRenderer(REMOVE_TAG_FROM_NOTE, data);
        
    //     // Remove tag from the app state
    //     let newTags = this.props.currentNoteTags.filter((tag: string) => { return tag !== name; });
    //     this.props.updateTags(newTags);
    // }
    removeTag(name: string) {
        console.log('Remove tag: ' + name);
    }

    render() {
        return (
            <div className="tags">
                {(this.props.tags as string[]).map((name: string, index: number) => {
                    return (
                        <span 
                            key={name}
                            className="badge badge-primary tag-name"
                        >{name} <span className="oi oi-delete remove-tag" onClick={() => { this.removeTag(name); }}/>
                        </span>
                    );
                })}
            </div>
        );
    }
}

export default TagList;