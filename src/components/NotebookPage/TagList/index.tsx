import * as React from 'react';
import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
import { GET_TAGS_FOR_NOTE } from '../../../constants/index';

export interface Props {
    currentNoteTags: string[];
    notebookName: string;
    noteName: string;
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

    render() {
        return (
            <div className="tags">
                {(this.props.currentNoteTags as string[]).map((name: string, index: number) => {
                    return (
                        <span 
                            key={name}
                            className="badge badge-primary tag-name"
                        >{name} <span className="oi oi-x remove-tag"/>
                        </span>
                    );
                })}
            </div>
        );
    }
}

export default TagList;