import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";

export default Login = () => {
	// Add user's username and password to React state
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	// Check that user entered in a username and a password
	const checkForm = () => {
		return username.length > 0 && password.length > 0;
	}

	const handleSubmit = (event) => {
		event.preventDefault();
	}

	return (
	  <div className="login">
	    <Form onSubmit={handleSubmit}>
	      <Form.Group size="md" controlId="username">
		<Form.Label>Username</Form.Label>
		<Form.Control 
		  autoFocus 
		  type="username" 
		  value={username} 
		  onChange={(e) => setUsername(e.target.value)}
		/>
	      </Form.Group>
	      <Form.Group size="md" controlId="password">
		<Form.Label>Password</Form.Label>
		<Form.Control
		  type="password"
		  value={password}
		  onChange={(e) => setPassword(e.target.value)}
		/>
	      </Form.Group>
	      <Button block size="md" type="submit" disabled={!validateForm()}>
		Login
	      </Button>
	    </Form>
	  </div>
	);
}
