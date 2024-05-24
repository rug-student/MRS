import React, { useState } from 'react';
import './login.css';
import Header from '../components/Header';
import useAuthContext from '../context/AuthContext';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login, errors } = useAuthContext();


  const handleSubmit = async (e) => {
    e.preventDefault();
    login({email, password});
    setMessage(errors);
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
