import React, { useEffect, useState } from 'react';
import '../styleSheets/LoginPage.css';
import Header from '../components/Header';
import useAuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const {login, errors, checkLoggedIn } = useAuthContext();

  const navigate = useNavigate();

  useEffect (() => {
    checkLoggedIn(true, '/');
    setMessage(errors.email);
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({email, password});
    setMessage(errors.email);
  };

  return (
    <div className="page">
    <Header />
      <div className="login-page">
        <div id="logform1">
          <h1>Login</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label className="labuno">Email:</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id ="inuno"
                  />
            </div>
            <div>
              <label className="labuno">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="indue"
              />
            </div>
        <button id="subutton" type="submit">Login</button>
      </form>
      <p className='errorMessage'>{message}</p>
    </div>
  </div>
</div>
  );
}

export default LoginPage;
