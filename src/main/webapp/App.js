import React from 'react';
import { HashRouter, Route, Redirect } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { createHashHistory } from "history";
import Auth from './components/Auth/Auth';
import Editor from './components/Editor/Editor'
import Projects from './components/Projects/Projects'
import { useSelector } from 'react-redux';



const history = createHashHistory();

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

function App() {
  const user = useSelector((state) => state.userReducer);
  const isAuthenticated = () => {
    return user.isSignedIn;
  }

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isAuthenticated()
        ? <Component {...props} />
        : <Redirect to='/' />
    )} />
  )

  return (
    <ThemeProvider theme={theme}>
      <HashRouter history={history}>
        <Route  path="/" exact component={Auth} />
        <PrivateRoute path="/editor" exact component={Editor} />
        <PrivateRoute path="/projects" exact component={Projects} />
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
