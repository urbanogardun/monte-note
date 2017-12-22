import * as React from 'react';
import './App.css';
import HomePage from './components/HomePage/index';
import Welcome from './components/WelcomePage/Welcome';
import ElectronMessager from './utils/electron-messaging/electronMessager';

class App extends React.Component {

  isNotebooksLocationSet: boolean;

  render() {

    let componentToRender = <Welcome />;
    this.isNotebooksLocationSet = ElectronMessager.isLocationForNotebooksSet();
    if (this.isNotebooksLocationSet) {
      componentToRender = <HomePage />;
    }

    return (
      <div className="App container-fluid">
        
        {componentToRender}

      </div>
    );
  }
}

export default App;
