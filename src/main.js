import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Home from './Home';
import store from './store';

function RootComponent() {
  return (
    <Provider store={store}>
      <Home/>
    </Provider>
  );
}

ReactDOM.render(<RootComponent />, document.getElementById('react-main'));
