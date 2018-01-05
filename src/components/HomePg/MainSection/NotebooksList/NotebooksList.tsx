import * as React from 'react';
import ElectronMessager from '../../../../utils/electron-messaging/electronMessager';
import { GET_NOTEBOOKS } from '../../../../constants/index';
import { Link } from 'react-router-dom';

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
                <Link to="/notebooks/about">Link to Notebook</Link>
                <ul>
                    {(this.props.notebooks as string[]).map((name: string, index: number) => {
                        return <Link to={`/notebooks/${name}`} key={name}><li>{name}</li></Link>;
                    })}
                </ul>
            </div>
        );
    }
}

export default NotebooksList;