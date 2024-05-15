import React, { useState } from 'react';
import './login.css';
import Header from './Header';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const csrf =  () => fetch('http://localhost:8000/sanctum/csrf-cookie', {
    method: 'GET'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    csrf();
    fetch(`http://localhost:8000/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': ''
      },
      body: JSON.stringify({
        email: email, 
        password: password,
      })
    })
    .then(response => {
      if (response.status == 204) {
        // Handle successful response
        setMessage("Succesfully logged in.")
      } else {
        // Handle error response
        setMessage("Invalid email or password.")
      }
    })
  };

  return (
    <div>
    <Header />
    <div className="App">
        <div id="logform">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input type="hidden" name="_token" value="{{ csrf_token() }}" />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
    </div>
    </div>
  );
}

export default App;
