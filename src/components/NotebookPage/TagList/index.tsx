import * as React from 'react';
// import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
// import { ADD_TAG_TO_NOTE } from '../../../constants/index';

export interface Props {
    tags: string[];
}

export interface State {
    tag: string;
}

export class TagList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div className="tags">
                {(this.props.tags as string[]).map((name: string, index: number) => {
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