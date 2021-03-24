import React, { useState, KeyboardEvent } from "react";
import {
  Paper,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CardMedia,
  Slide,
  TextField,
  Grid,
  IconButton,
  Button
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
//import axios from 'wherever we end up putting api info';

export default Auth = () => {
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
  };

  // Handles showing the signIn window
  const showSignIn = () => {
    setSignInDirection('left');
    setMainDirection('right');
    setSignInVisible(true);
    setMainVisible(false);
  };


  // Handles and checks keypress and calls the callback method
  const handleKeyPress = (e, callBack) => {
    if (e.key === 'Enter') {
      callBack();
    };
  };

  // Validates user entered sign up information correctly
  const handleOnSignUpSubmit = (username, password, email, callBack) => {
    let error = false;
    if (username === '') {
      setUsernameError(true);
      setUsernameErrorMsg('Username cannot be empty');
      error = true;
    } else setUsernameError(false);
    if (password.length < 8 || password.length > 60) {
      setPasswordError(true);
      setPasswordErrorMsg('Password must be greater than 8 characters' 
	     + ' and less than 60 characters');
      error = true;
    } else setPasswordError(false);
    if (email === '') {
      setEmailError(true);
      setEmailErrorMsg('Email cannot be empty');
      error = true;
    } else setEmailError(false);

    if (!error) {
      callBack();
    };
  };
  

  // Checks that user entered login information correctly
  const handleOnLoginSubmit = (username, password, callBack) => {
    let error = false;
    if (username === '') {
      setUsernameError(true);
      setUsernameErrorMsg('Username cannot be empty');
      error = true;
    } else setUsernameError(false);
    if (password.length < 6 || password.length > 60) {
      setPasswordError(true);
      setPasswordErrorMsg('Password cannot be empty');
      error = true;
    } else setPasswordError(false);

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

      if (response.status === 200) {
        // Direct user to next page
      } else {
        // Inform user of error
      };
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
  const handleSignIn = async (username: string, password: string) => {
    // Encode username and password - it may have # $ & + ,  / : ; = ? @ [ ]
    username = encodeURIComponent(username);
    password = encodeURIComponent(password);

    try {
      // Get information from datastore about user
      const response = await axios.get(`/sign-in?username=${username}&password=${password}`);
      if (response.status === 200) {
        // Redirect user to next page
      } else {
        // If error occurs notify user
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
  
  // Handles account login
  const handleSignIn = async (username: string, password: string) => {
    // Encode username and password - it may have # $ & + ,  / : ; = ? @ [ ]
    username = encodeURIComponent(username);
    password = encodeURIComponent(password);

    try {
      // Get information from datastore about user
      const response = await axios.get(`/sign-in?username=${username}&password=${password}`);
      if (response.status === 200) {
        // Redirect user to next page
      } else {
        // If error occurs notify user
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

  return (
    <div className="auth-wrapper">
      <Paper className="container-prompt">
      </Paper>
    </div>
  );
}
