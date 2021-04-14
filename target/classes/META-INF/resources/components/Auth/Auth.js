import React, { useState, useRef } from "react";
import { useDispatch } from 'react-redux';
import axios from '../Api/Api';
import { loadInitialProjects, loadUsers, signIn } from '../../actions';
import './Auth.css';

const Auth = ({ history }) => {
  // Dispatch for react-redux store
  const dispatch = useDispatch();
	
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
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMsg, setNameErrorMsg] = useState('');

  // to switch between sign in and sign up
  const [displaySignIn, setDisplaySignIn] = useState(true);
  const [displaySignUp, setDisplaySignUp] = useState(false);
  const signInRef = useRef();
  const signUpRef = useRef();

  const openSignIn = () => {
    if (!displaySignIn) {
      setDisplaySignIn(true);
      setDisplaySignUp(false);

      signInRef.current.classList.add("visible_sign_in");
      signInRef.current.classList.remove("hidden_sign_in")

      signUpRef.current.classList.remove("visible_sign_up");
      signUpRef.current.classList.add("hidden_sign_up");
      ;
    }
    console.log("Opened sign in")
  }

  const openSignUp = () => {
    if (!displaySignUp) {
      setDisplaySignIn(false);
      setDisplaySignUp(true);

      signInRef.current.classList.remove("visible_sign_in");
      signInRef.current.classList.add("hidden_sign_in")

      signUpRef.current.classList.add("visible_sign_up");
      signUpRef.current.classList.remove("hidden_sign_up");
    }
    console.log("Openned signup")
  }


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
  const handleOnSignUpSubmit = (username, password, email, name, callBack) => {
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
    if (name === '') {
      setNameError(true);
      setNameErrorMsg('Name cannot be empty');
      error = true;
    } else {
      setNameError(false);
      setNameErrorMsg('');
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
  const handleSignUp = async (username, password, email, name) => {
    try {
      // Encode username, password & email they may have special symbols
      username = encodeURIComponent(username);
      password = encodeURIComponent(password);
      email = encodeURIComponent(email);
      name = encodeURIComponent(name);

      // Check if username is taken and email is valid then add to Datastore
      const response = await axios.post(
               `/sign-up?username=${username}
              &password=${password}&email=${email}&name=${name}`);

      if (response.status !== 200) {
        setUsernameError(true);
        setUsernameErrorMsg('Unable to sign up at this time please try again');
        setPasswordError(true);
        setPasswordErrorMsg('Unable to sign up at this time please try again');
        setEmailError(true);
        setEmailErrorMsg('Unable to sign up at this time please try again');
        setNameError(true);
        setNameErrorMsg('Unable to sign up at this time please try again');
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
      dispatch(signIn({ username: username, email: email, name: name, 
      	appearingOnline: true }));
      dispatch(loadUsers(username));
      dispatch(loadInitialProjects(username));
      history.push('/projects');
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
	const errorAndInfo = response.data;
	const userExists = errorAndInfo[0] === 'true' ? true : false;
	if (!userExists) {
	  setUsernameError(true);
	  setUsernameErrorMsg('Username or password entered incorrectly');
	  setPasswordError(true);
	  setPasswordErrorMsg('Username or password entered incorrectly');
	} else {
	  const appearingOnline = errorAndInfo[3] === 'true' ? true : false;
	  dispatch(signIn({ username: username, email: errorAndInfo[1], 
		  name: errorAndInfo[2], appearingOnline: appearingOnline }));
	  dispatch(loadUsers(username));
	  dispatch(loadInitialProjects(username));
	  history.push('/projects'); 
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
  
  //Render signup modal with input fields for user
  const renderSignUp = () => {
    return (
      <div container spacing={1} justify="center" alignItems="center">
        <div item  className="grid-textfield">
          <textarea
            id="name"
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            margin="dense"
            autoComplete="off"
            variant="outlined"
            onKeyPress={e =>
              handleKeyPress(e, () =>
                handleOnSignUpSubmit(username, password, email, name,
                        () => handleSignUp(username, password, email, name))
              )
            }
          />
	    {nameError ?
	      <span>
		{nameErrorMsg}
	      </span> : <div></div>
	    }
          </div>
          <div className="grid-textfield">
            <textarea
              id="username"
              label="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              margin="dense"
              autoComplete="off"
              onKeyPress={e =>
                handleKeyPress(e, () =>
                  handleOnSignInSubmit(username, password,
                          () => handleSignIn(username, password))
                )
              }
            />
	    {usernameError ?
	    <span>{usernameErrorMsg}</span>
	    : <div></div>
	    }
          </div>
	  <div className="grid-textfield">
            <textarea
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="off"
              onKeyPress={e =>
                handleKeyPress(e, () =>
                  handleOnSignInSubmit(username, password,
                          () => handleSignIn(username, password))
                )
              }
            />
	    {passwordError ?
	    <span>
              {passwordErrorMsg}
	    </span>
	    : <div></div> }
          </div>
          <div className="grid-textfield">
            <textarea
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="off"
              onKeyPress={e =>
                handleKeyPress(e, () =>
                  handleOnSignUpSubmit(username, password, email, name,
                          () => handleSignUp(username, password, email, name))
                )
              }
            />
	    {emailError ?
	    <span>{emailErrorMsg}</span>
	    : <div></div>
	    }
          </div>
          <div className="grid-button">
            <button
              onClick={() => handleOnSignUpSubmit(username, password, email, name,
                      () => handleSignUp(username, password, email, name))}
            >
              Sign Up
            </button>
          </div>
        </div>
    );
  }
  
  // Render sign in Modal with input fields
  const renderSignIn = () => {
    return (
      
      <div className="user_details">
        <div className="input">
          <input 
            type="text"
            id="username_input"
            name="username_input"
            placeholder="Username"
            className="Auth_input"
            onChange={e => setUsername(e.target.value)}
            value={username}
            autoComplete="off"
            onKeyPress={e =>
              handleKeyPress(e, () =>
                handleOnSignInSubmit(username, password,
                        () => handleSignIn(username, password))
              )
            }/>

          {usernameError && (
            <span className="error">{usernameErrorMsg}</span>
          )}
        </div>

        <div className="input">
          <input 
            type="password"
            id="password_input"
            name="password_input"
            placeholder="Password"
            className="Auth_input"
            onChange={e => setPassword(e.target.value)}
            value={password}
            autoComplete="off"
            onKeyPress={e =>
              handleKeyPress(e, () =>
                handleOnSignInSubmit(username, password,
                        () => handleSignIn(username, password))
              )
            }/>

          {passwordError && (
            <span className="error">{passwordErrorMsg}</span>
          )}
        </div>
        
        <div className="Sign_in_button_container">
          <button
            className="Sign_in_button"
            onClick={() => handleOnSignInSubmit(username, password,
                    () => handleSignIn(username, password))}>
            Sign In
          </button>
        </div>
        </div>
    );
  };


  return (
    <div className="Auth_container">
      <div className="Auth_header">
        <span className="Auth_title">
          COLLABCODE
        </span>
      </div>

      <div className="Auth_main">
          <div className="Auth_content card">
            <div className="Auth_buttons_container">
              <button className="Auth_button left_button" onClick={openSignIn}>
                SIGN IN
              </button>
              <button className="Auth_button right_button" onClick={openSignUp}>
                SIGN UP
              </button>
            </div>
                 
            <div className="Signin_signup">                    
              <div className="dummy_sign_in visible_sign_in" ref={signInRef} >
                {renderSignIn()}
              </div>

              <div className="dummy_sign_up hidden_sign_up" ref={signUpRef}>
                {renderSignUp()}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default Auth;
