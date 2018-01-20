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
                        {(this.props.allTags as string[]).map((name: string, index: number) => {
                            return (
                                <li 
                                    key={name}
                                    onClick={(e) => { this.selectTag(name); }} 
                                    className="list-group-item sidebar-note"
                                >
                                    {name}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

export default TagList;