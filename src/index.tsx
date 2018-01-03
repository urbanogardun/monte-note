import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './containers/App/App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'jquery';

import reduxStore from './store/index';
import { Route } from 'react-router';
import { Notebook } from './components/NotebookPage/index';

ReactDOM.render(
  <Provider store={reduxStore}>
    <BrowserRouter>
      <div>
        <Route path="/about" component={Notebook}/>
        <Route exact={true} path="/" component={App} />
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
