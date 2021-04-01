import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { createHashHistory } from "history";
import Auth from './components/Auth/Auth';
import Editor from './components/Editor/Editor'

const history = createHashHistory();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter history={history}>
        <Route path="/" exact component={Editor} />
        {/* <Route path="/" exact component={Auth} /> */}
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
