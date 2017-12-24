import * as React from 'react';
import './App.css';
import HomePage from './components/HomePage/index';
import Welcome from './containers/WelcomePage/Welcome';
// import ElectronMessager from './utils/electron-messaging/electronMessager';

interface Props {
  enthusiasmLevel?: number;
}

class App extends React.Component<Props, object> {

  isNotebooksLocationSet: boolean;

  render() {
    let enthusiasmLevel = this.props.enthusiasmLevel as number;

    let componentToRender = <Welcome name={'John'} notebooksLocation={''} />;
    if (enthusiasmLevel >= 2) {
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
