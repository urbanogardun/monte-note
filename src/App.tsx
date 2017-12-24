import * as React from 'react';
import './App.css';
import HomePage from './components/HomePage/index';
import Welcome from './containers/WelcomePage/Welcome';
import ElectronMessager from './utils/electron-messaging/electronMessager';

class App extends React.Component<any, any> {

  isNotebooksLocationSet: boolean;

  render() {

    let componentToRender = <Welcome name={'John'} notebooksLocation={''} />;
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
