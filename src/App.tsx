import * as React from 'react';
import './App.css';
import NewNotebook from './components/HomeSidebar/NewNotebook/NewNotebook';
import Welcome from './components/WelcomeScreen/Welcome';

class App extends React.Component {
  render() {
    return (
      <div className="App container-fluid">
        
        <Welcome />

        <div className="row">
          <div className="col-sm-2">
            <NewNotebook name={'John'} />
          </div>
          <div className="col-sm-4">
            <h1>Main</h1>
          </div>
          <div className="col-sm">
            <h1>Preview Note Content</h1>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
