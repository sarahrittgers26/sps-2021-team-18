import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from "react-router"; 
import { createHashHistory } from "history";
import './index.css';
import App from './main/webapp/App.js';

const history = createHashHistory();

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('root')
);

