import * as React from 'react';
import ElectronMessager from '../../../../utils/electron-messaging/electronMessager';
import { GET_NOTEBOOKS } from '../../../../constants/index';

export interface Props {
    notebooks?: string[];
}

export interface State {
    notebooks: string[];
}

export class NotebooksList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            notebooks: [],
        };
    }

    componentDidMount() {
        ElectronMessager.sendMessageWithIpcRenderer(GET_NOTEBOOKS);
    }

    render() {
        return (
            <div className="col-sm-4">
                <h1>Notebooks List!</h1>
                <ul>
                    {(this.props.notebooks as string[]).map((name: string, index: number) => {
                        return <li key={index}>{name}</li>;
                    })}
                </ul>
            </div>
        );
    }
}

export default NotebooksList;