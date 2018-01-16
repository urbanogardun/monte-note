import * as React from 'react';
import SearchBar from './SearchBar/index';

export class MainSection extends React.Component {

    render() {
        return (
            <div className="col notes-index">
                <ul className="list-group">
                    <SearchBar />
                    {/* <li className="list-group-item note-item search-home">
                        <div className="input-group input-group-sm mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                aria-label="Small" 
                                aria-describedby="inputGroup-sizing-sm" 
                                placeholder="Search Notebooks" 
                            />
                            <div className="input-group-append">
                            <button 
                                className="btn btn-outline-secondary dropdown-toggle home-search" 
                                type="button" 
                                data-toggle="dropdown" 
                                aria-haspopup="true" 
                                aria-expanded="false"
                            >
                                <span className="oi oi-chevron-bottom search-dropdown"/>
                            </button>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" href="#"><span className="oi oi-check"/> All Notebooks</a>
                                <div role="separator" className="dropdown-divider"/>
                                <a className="dropdown-item" href="#">Chemistry 101</a>
                                <a className="dropdown-item" href="#">Biology</a>
                                <a className="dropdown-item" href="#">Introduction to Advertising</a>
                            </div>
                            </div>
                        </div>
                    </li> */}
                    <li className="list-group-item note-item">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Note Name</h5>
                                <h6 className="card-subtitle mb-2 notebook-name">
                                    <span className="oi oi-book"/> Notebook Name</h6>
                                <p className="card-text">Stripped text from HTML tags prev...</p>
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item note-item">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Chemistry Fundamentals</h5>
                                <h6 className="card-subtitle mb-2 notebook-name">
                                    <span className="oi oi-book"/> Chemistry 101</h6>
                                <p className="card-text">Chemistry is a science that involves...</p>
                            </div>
                        </div>
                    </li>
                </ul>

            </div>
        );
    }
}

export default MainSection;