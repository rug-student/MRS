import React, { useState } from 'react';
import './login.css';
import Header from './Header';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform simple validation (replace this with your actual validation logic)
    if (username === 'admin' && password === 'password') {
      setMessage('Login successful!');
    } else {
      setMessage('Invalid username or password');
    }
  };

  return (
    <div>
    <Header />
    <div className="App">
        <div id="logform">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
    </div>
    </div>
  );
}

export default App;
