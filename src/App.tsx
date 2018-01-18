import * as React from 'react';
import './App.css';
import HomePage from './containers/HomePage/HomePage';
import Welcome from './containers/WelcomePage/Welcome';
import ElectronMessager from './utils/electron-messaging/electronMessager';
import { GET_NOTEBOOKS_LOCATION, NOTEBOOKS_LOCATION_NOT_SET } from './constants/index';

interface Props {
  enthusiasmLevel?: number;
  notebooksLocation?: string;
  notebooks: string[];
  searchResults: object[];
  previewContent: object;
  updateTags: Function;
}

class App extends React.Component<Props, object> {

  isNotebooksLocationSet: boolean;

  componentWillMount() {
    ElectronMessager.sendMessageWithIpcRenderer(GET_NOTEBOOKS_LOCATION);
  }

  render() {
    let notebooksLocation = this.props.notebooksLocation as string;

    let componentToRender = ( <div /> );
    // Render HomePage component only when notebookslocation prop value gets received and
    // if it got set by user
    if ( (notebooksLocation !== NOTEBOOKS_LOCATION_NOT_SET) && (notebooksLocation.length) ) {
      componentToRender = (
      <HomePage 
        notebooks={this.props.notebooks} 
        searchResults={this.props.searchResults}
        previewContent={this.props.previewContent} 
        updateTags={this.props.updateTags}
      />);
    } else if (notebooksLocation === NOTEBOOKS_LOCATION_NOT_SET) {
      componentToRender = <Welcome name={'John'} notebooksLocation={''} />;
    }

    return (
      <div className="container-fluid notebook-container">
        
        {componentToRender}

      </div>
    );
  }
}

export default App;
