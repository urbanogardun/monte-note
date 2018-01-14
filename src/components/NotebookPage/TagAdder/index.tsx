import * as React from 'react';

export interface Props {}

export interface State {}

export class TagAdder extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div className="tag-manager">
                <div className="input-group input-group-sm mb-3 add-tags">
                    <div className="input-group-prepend">
                        <button className="btn btn-outline-secondary" type="button">Add</button>
                    </div>
                    <input 
                        type="text" 
                        className="form-control" 
                        aria-label="Small" 
                        placeholder="Tag name..." 
                        aria-describedby="inputGroup-sizing-sm"
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