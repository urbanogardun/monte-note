import * as React from 'react';

export interface Props {
    notebookName: string;
    lastOpenedNote: string;
}

export interface State {
    tag: string;
}

export class TagAdder extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            tag: ''
        };
    }

    // Adds tag on Enter key press
    handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            console.log(`Add tag for note: ${this.props.lastOpenedNote} in notebook: ${this.props.notebookName}`);
            // console.log(this.state);
            // let note = this.prepareNote(this.state.inputValue as string);
            // this.addNote(note);
            // this.resetComponentState();
        }
    }

    updateInputValue(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({tag: e.target.value});
    }

    render() {
        return (
            <div className="tag-manager">
                <div className="input-group input-group-sm mb-3 add-tags">
                    <div className="input-group-prepend">
                        <button className="btn btn-outline-secondary" type="button">Add</button>
                    </div>
                    <input 
                        value={this.state.tag}
                        onChange={e => this.updateInputValue(e)}
                        type="text"
                        className="form-control" 
                        aria-label="Small" 
                        placeholder="Tag name..." 
                        aria-describedby="inputGroup-sizing-sm"
                        onKeyPress={(e) => this.handleKeyPress(e)}
                    />
                </div>
                <div className="tags">
                    <span 
                        className="badge badge-primary tag-name"
                    >Tag 1 <span className="oi oi-x remove-tag"/>
                    </span>
                    <span 
                        className="badge badge-primary tag-name"
                    >Tag 2 <span className="oi oi-x remove-tag"/>
                    </span>
                    <span 
                        className="badge badge-primary tag-name"
                    >Tag 3 <span className="oi oi-x remove-tag"/>
                    </span>
                    <span 
                        className="badge badge-primary tag-name"
                    >Tag 4 <span className="oi oi-x remove-tag"/>
                    </span>
                    <span 
                        className="badge badge-primary tag-name"
                    >Tag 5 <span className="oi oi-x remove-tag"/>
                    </span>
                    <span 
                        className="badge badge-primary tag-name"
                    >Tag 6 <span className="oi oi-x remove-tag"/>
                    </span>
                    <span 
                        className="badge badge-primary tag-name"
                    >Tag 7 <span className="oi oi-x remove-tag"/>
                    </span>
                    <span 
                        className="badge badge-primary tag-name"
                    >Tag 8 <span className="oi oi-x remove-tag"/>
                    </span>
                    <span 
                        className="badge badge-primary tag-name"
                    >Tag 9 <span className="oi oi-x remove-tag"/>
                    </span>
                    <span 
                        className="badge badge-primary tag-name"
                    >Tag 10 <span className="oi oi-x remove-tag"/>
                    </span>
                    <span 
                        className="badge badge-primary tag-name"
                    >Tag 11 <span className="oi oi-x remove-tag"/>
                    </span>
                    <span 
                        className="badge badge-primary tag-name"
                    >Tag 12 <span className="oi oi-x remove-tag"/>
                    </span>
                </div>
            </div>
        );
    }
}

export default TagAdder;