import * as React from 'react';
import './App.css';
import HomePage from './containers/HomePage/HomePage';
import Welcome from './containers/WelcomePage/Welcome';
import ElectronMessager from './utils/electron-messaging/electronMessager';
import { 
  GET_NOTEBOOKS_LOCATION, NOTEBOOKS_LOCATION_NOT_SET, RELOAD_SEARCH_RESULTS, GET_ALL_TAGS } from './constants/index';

interface Props {
  enthusiasmLevel?: number;
  notebooksLocation?: string;
  notebooks: string[];
  searchResults: object[];
  previewContent: object;
  updateTags: Function;
  history: any;
  allTags: string[];
  updateSelectedTags: Function;
  selectedTags: string[];
  updateSearchQuery: Function;
  searchQuery: string;
  updateSelectedNotebook: Function;
  selectedNotebook: string;
  lastOpenedNote: string;
  updatePreview: Function;
  previewData: object;
}

class App extends React.Component<Props, object> {

  isNotebooksLocationSet: boolean;

  componentWillMount() {
    ElectronMessager.sendMessageWithIpcRenderer(GET_NOTEBOOKS_LOCATION);
    ElectronMessager.sendMessageWithIpcRenderer(RELOAD_SEARCH_RESULTS);
    ElectronMessager.sendMessageWithIpcRenderer(GET_ALL_TAGS);
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
        goToRoute={this.props.history.push}
        allTags={this.props.allTags}
        updateSelectedTags={this.props.updateSelectedTags}
        selectedTags={this.props.selectedTags}
        updateSearchQuery={this.props.updateSearchQuery}
        searchQuery={this.props.searchQuery}
        updateSelectedNotebook={this.props.updateSelectedNotebook}
        selectedNotebook={this.props.selectedNotebook}
        lastOpenedNote={this.props.lastOpenedNote}
        updatePreview={this.props.updatePreview}
        previewData={this.props.previewData}
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
