import * as React from 'react';
import ElectronMessager from '../../../../utils/electron-messaging/electronMessager';
import { REMOVE_TAG_FROM_NOTE } from '../../../../constants/index';

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

    removeTag(name: string) {
        let data = {
            notebook: this.props.notebookName,
            note: this.props.noteName,
            tag: name
        };
        ElectronMessager.sendMessageWithIpcRenderer(REMOVE_TAG_FROM_NOTE, data);
        
        // Remove tag from the app state
        let newTags = this.props.tags.filter((tag: string) => { return tag !== name; });
        this.props.updateTags(newTags);
    }

    render() {
        return (
            <div className="preview-note-tags">
                {(this.props.tags as string[]).map((name: string, index: number) => {
                    return (
                        <span 
                            key={name}
                            className="badge badge-light tag-pill"
                        >{name} <span className="oi oi-delete delete-tag" onClick={() => { this.removeTag(name); }}/>
                        </span>
                    );
                })}
            </div>
        );
    }
}

export default TagList;