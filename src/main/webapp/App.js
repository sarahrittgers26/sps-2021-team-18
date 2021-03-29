import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import Auth from './main/webapp/components/Auth/Auth';
import Editor from './main/webapp/components/Editor/Editor'


function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Route path="/" exact component={Auth} />
        <Route path="/editor" exact component={Editor} />
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#6E4AB1'
    },
    secondary: {
      main: '#000000'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600
  }
});