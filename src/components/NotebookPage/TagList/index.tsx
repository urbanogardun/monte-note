import * as React from 'react';
import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
import { GET_TAGS_FOR_NOTE, REMOVE_TAG_FROM_NOTE } from '../../../constants/index';

export interface Props {
    currentNoteTags: string[];
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

    componentWillUpdate(nextProps: Props) {
        if ( (this.props.noteName !== nextProps.noteName) && (this.props.notebookName === nextProps.notebookName) ) {
            // console.log(`Get tags for note: ${nextProps.noteName} from notebook: ${nextProps.notebookName}`);
            let data = {
                notebook: nextProps.notebookName,
                note: nextProps.noteName,
            };
            ElectronMessager.sendMessageWithIpcRenderer(GET_TAGS_FOR_NOTE, data);
        }
    }

    removeTag(name: string) {
        let data = {
            notebook: this.props.notebookName,
            note: this.props.noteName,
            tag: name
        };
        ElectronMessager.sendMessageWithIpcRenderer(REMOVE_TAG_FROM_NOTE, data);
        
        // Remove tag from the app state
        let newTags = this.props.currentNoteTags.filter((tag: string) => { return tag !== name; });
        this.props.updateTags(newTags);
    }

    render() {
        return (
            <div className="tags">
                {(this.props.currentNoteTags as string[]).map((name: string, index: number) => {
                    return (
                        <span 
                            key={name}
                            className="badge badge-primary tag-name"
                        >{name} <span className="oi oi-x remove-tag" onClick={() => { this.removeTag(name); }}/>
                        </span>
                    );
                })}
            </div>
        );
    }
}

export default TagList;