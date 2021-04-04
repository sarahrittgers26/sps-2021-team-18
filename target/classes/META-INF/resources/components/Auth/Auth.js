import React, { useState } from "react";
import {
  Paper,
  Card,
  Typography,
  CardActionArea,
  Slide,
  TextField,
  Grid,
  IconButton,
  Button
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
//import { useDispatch } from 'react-redux';
import createHashHistory from '../../history';
import axios from '../Api/Api';

const Auth = ({ history }) => {
  // Dispatch for react-redux store
  // const dispatch = useDispatch();
	
  // Local state control of displaying sign-in or sign-up info
  const [mainVisible, setMainVisible] = useState(true);
  const [mainDirection, setMainDirection] = useState('left');
  const [signUpVisible, setSignUpVisible] = useState(false);
  const [signUpDirection, setSignUpDirection] = useState('left');
  const [signInVisible, setSignInVisible] = useState(false);
  const [signInDirection, setSignInDirection] = useState('left');

  // Store user's information in React state
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMsg, setUsernameErrorMsg] = useState('');
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState('');;

  // Show main modal which gives user the option to signin or signup
  const showMain = () => {
    setMainDirection('left');
    setMainVisible(true);
    setSignUpVisible(false);
    setSignUpDirection('right');
    setSignInVisible(false);
    setSignInDirection('right');
  };

  // Handles showing the signup window
  const showSignUp = () => {
    setSignUpDirection('left');
    setMainDirection('right');
    setSignUpVisible(true);
    setMainVisible(false);
    setSignInDirection('right');
    setSignInVisible(false);
    setUsernameErrorMsg('');
    setUsernameError(false);
    setPasswordErrorMsg('');
    setPasswordError(false);
    setEmailErrorMsg('');
    setEmailError(false);
  };

  // Handles showing the signIn window
  const showSignIn = () => {
    setSignInDirection('left');
    setMainDirection('right');
    setSignInVisible(true);
    setMainVisible(false);
    setSignUpDirection('right');
    setSignUpVisible(false);
    setUsernameErrorMsg('');
    setUsernameError(false);
    setPasswordErrorMsg('');
    setPasswordError(false);
    setEmailErrorMsg('');
    setEmailError(false);
  };

  // Handles and checks keypress and calls the callback method
  const handleKeyPress = (e, callBack) => {
    if (e.key === 'Enter') {
      callBack();
    };
  };

  // Checks that email is in a valid email address form
  // Code Reference: 
  // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  const validateEmail = (email) => {
    // Breaks regex expression into strings to remain under 80 characters
    var re = new RegExp(['^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s',
	    '@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]',
	    '{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$']);
    return re.test(String(email).toLowerCase());
  }

  // Validates user entered sign up information correctly
  const handleOnSignUpSubmit = (username, password, email, callBack) => {
    let error = false;
    if (username === '') {
      setUsernameError(true);
      setUsernameErrorMsg('Username cannot be empty');
      error = true;
    } else { 
      setUsernameError(false);
      setUsernameErrorMsg('');
    }
    if (password.length < 8 || password.length > 60) {
      setPasswordError(true);
      setPasswordErrorMsg('Password must be greater than 8 characters' 
	     + ' and less than 60 characters');
      error = true;
    } else {
      setPasswordError(false);
      setPasswordErrorMsg('');
    }
    if (email === '' || !validateEmail(email)) {
      setEmailError(true);
      setEmailErrorMsg('Please enter a valid email address format');
      error = true;
    } else {
      setEmailError(false);
      setEmailErrorMsg('');
    }

    if (!error) {
      callBack();
    };
  };
  

  // Checks that user entered login information correctly
  const handleOnSignInSubmit = (username, password, callBack) => {
    let error = false;
    if (username === '') {
      setUsernameError(true);
      setUsernameErrorMsg('Username cannot be empty');
      error = true;
    } else {
      setUsernameError(false);
      setUsernameErrorMsg('');
    }
    if (password === '') {
      setPasswordError(true);
      setPasswordErrorMsg('Password cannot be empty');
      error = true;
    } else {
      setPasswordError(false);
      setPasswordErrorMsg('');
    }

    if (!error) {
      callBack();
    };
  };

  // Handles creation of account
  const handleSignUp = async (username, password, email) => {
    try {
      // Encode username, password & email they may have special symbols
      username = encodeURIComponent(username);
      password = encodeURIComponent(password);
      email = encodeURIComponent(email);

      // Check if username is taken and email is valid then add to Datastore
      const response = await axios.post(
               `/sign-up?username=${username}
              &password=${password}&email=${email}`);

      if (response.status !== 200) {
        setUsernameError(true);
        setUsernameErrorMsg('Unable to sign up at this time please try again');
        setPasswordError(true);
        setPasswordErrorMsg('Unable to sign up at this time please try again');
        setEmailError(true);
        setEmailErrorMsg('Unable to sign up at this time please try again');
	return;
      }
	    
      // Get information about whether username or email is taken from response
      const errors = response.data;
      const usernameExists = errors[0];
      const emailExists = errors[1];

      // Let user known what type of error occurred
      if (usernameExists) {
	setUsernameError(true);	  
        setUsernameErrorMsg('Username is already taken');
      }
      if (emailExists) {
	setEmailError(true);
	setEmailErrorMsg('Email address has already been used');
      }
      if (usernameExists || emailExists) return;

      const signInInfo = { username: username, email: email };
      //dispatch(signIn(signInInfo));
      history.push('/editor');
    } catch (err) {
      // If error occurs notify user
      if (err) {
        setUsernameError(true);
        setUsernameErrorMsg(err.message);
        setPasswordError(true);
        setPasswordErrorMsg(err.message);
      };
    };
  };
  
  // Handles account login
  const handleSignIn = async (username, password) => {
    // Encode username and password - it may have # $ & + ,  / : ; = ? @ [ ]
    username = encodeURIComponent(username);
    password = encodeURIComponent(password);

    try {
      const response = await axios.post(
               `/sign-in?username=${username}
              &password=${password}`);

      if (response.status === 200) {
        // Direct user to next page
	const errorAndEmail = response.data
	const userExists = errorAndEmail[0] === 'true' ? true : false;
	if (!userExists) {
	  setUsernameError(true);
	  setUsernameErrorMsg('Username or password entered incorrectly');
	  setPasswordError(true);
	  setPasswordErrorMsg('Username or password entered incorrectly');
	} else {
	  const signInInfo = { username: username, email: errorAndEmail[1] };
	  //dispatch(signIn(signInInfo));
	  history.push('/editor'); 
	}
      } else {
        setUsernameError(true);
        setUsernameErrorMsg('Unable to sign in at this time please try again');
        setPasswordError(true);
        setPasswordErrorMsg('Unable to sign in at this time please try again');
      }
    } catch (err) {
      if (err) {
        setUsernameError(true);
        setUsernameErrorMsg(err.message);
        setPasswordError(true);
        setPasswordErrorMsg(err.message);
      };
    };
  };
  
  // Render options to sign-up or sign-in
  const renderMain = () => {
    return (
      <Grid container spacing={1} justify="center" alignItems="center">
        <Grid item sm={12} xs={12}>
          <Typography variant="h5" color="primary" align="center">
            Collaborative Coding
          </Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Card className="grid-card">
            <CardActionArea onClick={() => showSignUp()}>
              <Typography variant="h5" color="primary" gutterBottom>
                Sign Up
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Card className="grid-card">
            <CardActionArea onClick={() => showSignIn()}>
              <Typography variant="h5" color="primary" gutterBottom>
                Sign In
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    );
  }
  
   // Render signup modal with input fields for user
  const renderSignUp = () => {
    return (
      <Slide direction={signUpDirection} in={signUpVisible} timeout={350}
            mountOnEnter unmountOnExit>
        <Grid container spacing={1} justify="center" alignItems="center">
          <Grid item xs={12}>
            <IconButton onClick={showMain}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" color="primary" align="center">
              Sign Up
            </Typography>
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <TextField
              id="username"
              label="Username"
              value={username}
              error={usernameError}
              helperText={usernameErrorMsg}
              onChange={e => setUsername(e.target.value)}
              margin="dense"
              autoComplete="off"
              variant="outlined"
              onKeyPress={e =>
                handleKeyPress(e, () =>
                  handleOnSignUpSubmit(username, password, email,
                          () => handleSignUp(username, password, email))
                )
              }
            />
          </Grid>
		  <Grid item xs={12} className="grid-textfield">
            <TextField
              id="password"
              label="Password"
              type="password"
              value={password}
              error={passwordError}
              helperText={passwordErrorMsg}
              onChange={e => setPassword(e.target.value)}
              margin="dense"
              autoComplete="off"
              variant="outlined"
              onKeyPress={e =>
                handleKeyPress(e, () =>
                  handleOnSignUpSubmit(username, password, email,
                          () => handleSignUp(username, password, email))
                )
              }
            />
          </Grid>
		  <Grid item xs={12} className="grid-textfield">
            <TextField
              id="email"
              label="Email"
              type="email"
              value={email}
              error={emailError}
              helperText={emailErrorMsg}
              onChange={e => setEmail(e.target.value)}
              margin="dense"
              autoComplete="off"
              variant="outlined"
              onKeyPress={e =>
                handleKeyPress(e, () =>
                  handleOnSignUpSubmit(username, password, email,
                          () => handleSignUp(username, password, email))
                )
              }
            />
          </Grid>
          <Grid item xs={12} className="grid-button">
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOnSignUpSubmit(username, password, email,
                      () => handleSignUp(username, password, email))}
            >
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </Slide>
    );
  }
  
  // Render sign in Modal with input fields
  const renderSignIn = () => {
    return (
      <Slide direction={signInDirection} in={signInVisible} timeout={350}
            mountOnEnter unmountOnExit>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item xs={12}>
            <IconButton onClick={showMain}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" color="primary" align="center">
              Sign In
            </Typography>
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <TextField
              id="username"
              label="Username"
              value={username}
              error={usernameError}
              helperText={usernameErrorMsg}
              onChange={e => setUsername(e.target.value)}
              margin="dense"
              autoComplete="off"
              variant="outlined"
              onKeyPress={e =>
                handleKeyPress(e, () =>
                  handleOnSignInSubmit(username, password,
                          () => handleSignIn(username, password))
                )
              }
            />
          </Grid>
		  <Grid item xs={12} className="grid-textfield">
            <TextField
              id="password"
              label="Password"
              type="password"
              value={password}
              error={passwordError}
              helperText={passwordErrorMsg}
              onChange={e => setPassword(e.target.value)}
              margin="dense"
              autoComplete="off"
              variant="outlined"
              onKeyPress={e =>
                handleKeyPress(e, () =>
                  handleOnSignInSubmit(username, password,
                          () => handleSignIn(username, password))
                )
              }
            />
          </Grid>
          <Grid item xs={12} className="grid-button">
            <Button
              className="modal-login-button"
              variant="contained"
              color="primary"
              onClick={() => handleOnSignInSubmit(username, password,
                      () => handleSignIn(username, password))}
            >
              Sign In
            </Button>
          </Grid>
        </Grid>
      </Slide>
    );
  };

  return (
    <div className="auth-wrapper">
      <Paper className="container-prompt">
        {renderMain()}
        {renderSignUp()}
        {renderSignIn()}
      </Paper>
    </div>
  );
}

export default Auth;
