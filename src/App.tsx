import * as React from 'react';
import './App.css';
import NewNotebook from './components/HomeSidebar/NewNotebook/NewNotebook';
import Welcome from './components/WelcomeScreen/Welcome';
import ElectronMessager from './utils/electron-messaging/electronMessager';

class App extends React.Component {

  isNotebooksLocationSet: boolean;

  componentDidMount() {
    this.isNotebooksLocationSet = ElectronMessager.isLocationForNotebooksSet();
  }

  render() {

    let componentToRender;
    if (this.isNotebooksLocationSet) {
      componentToRender = <NewNotebook />;
    } else {
      componentToRender = <Welcome />;
    }

    return (
      <div className="App container-fluid">
        
        {componentToRender}

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
