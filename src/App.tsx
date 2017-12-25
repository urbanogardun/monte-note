import * as React from 'react';
import './App.css';
import HomePage from './components/HomePage/index';
import Welcome from './containers/WelcomePage/Welcome';
// import ElectronMessager from './utils/electron-messaging/electronMessager';

interface Props {
  enthusiasmLevel?: number;
  notebooksLocation?: string;
}

class App extends React.Component<Props, object> {

  isNotebooksLocationSet: boolean;

  render() {
    console.log(this.props);
    let enthusiasmLevel = this.props.notebooksLocation as string;

    let componentToRender = <Welcome name={'John'} notebooksLocation={''} />;
    if (enthusiasmLevel) {
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
