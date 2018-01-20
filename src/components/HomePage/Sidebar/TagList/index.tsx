import * as React from 'react';

export interface Props {
    allTags: string[];
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

    selectTag(name: string) {
        let tags = this.state.selectedTags;
        tags.push(name);
        this.setState({
            selectedTags: tags
        });
        console.log('Selected tags: ' + this.state.selectedTags);
    }

    render() {
        console.log(this.props.allTags);
        return (
            <div>
                <div 
                    className="notebook-name-sidebar" 
                    data-toggle="collapse" 
                    data-target="#collapseExample2" 
                    aria-expanded="false" 
                    title="Tags"
                >
                    Tags
                    <span className="oi oi-chevron-bottom expand-notebook" />
                    <span className="oi oi-chevron-left expand-notebook" />
                </div>
                <div className="collapse notes-sidebar" id="collapseExample2">
                    <ul className="list-group notes">
                        <li 
                            onClick={(e) => { this.selectTag('apples'); }} 
                            className="list-group-item sidebar-note"
                        >
                            Cras justo odio
                        </li>
                        <li className="list-group-item sidebar-note">Dapibus ac facilisis in</li>
                        <li className="list-group-item sidebar-note">Morbi leo risus</li>
                        <li className="list-group-item sidebar-note">Porta ac consectetur ac</li>
                        <li className="list-group-item sidebar-note">Vestibulum at eros</li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default TagList;