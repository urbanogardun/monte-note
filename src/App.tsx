import * as React from 'react';
import './App.css';
import HomePage from './containers/HomePage/HomePage';
import Welcome from './containers/WelcomePage/Welcome';
import ElectronMessager from './utils/electron-messaging/electronMessager';
import { LOAD_SETTINGS } from './constants/index';

interface Props {
  enthusiasmLevel?: number;
  notebooksLocation?: string;
  notebooks: string[];
  searchResults: object[];
  previewContent: object;
}

class App extends React.Component<Props, object> {

  isNotebooksLocationSet: boolean;

  componentWillMount() {
    ElectronMessager.sendMessageWithIpcRenderer(LOAD_SETTINGS);
  }

  render() {
    let enthusiasmLevel = this.props.notebooksLocation as string;

    let componentToRender = <Welcome name={'John'} notebooksLocation={''} />;
    if (enthusiasmLevel) {
    componentToRender = (
    <HomePage 
      notebooks={this.props.notebooks} 
      searchResults={this.props.searchResults}
      previewContent={this.props.previewContent} 
    />);
    }

    return (
      <div className="container-fluid notebook-container">
        
        {componentToRender}

      </div>
    );
  }
}

export default App;
