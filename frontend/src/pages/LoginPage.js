import React, { useState } from 'react';
import './LoginPage.css';
import Header from '../components/Header';
import useAuthContext from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login, errors } = useAuthContext();


  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({email, password});
    console.log("errors: ", errors.email)
    setMessage(errors.email);
  };

  return (
    <div className="p">
    <Header />
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
        <input type="hidden" name="_token" value="{{ csrf_token() }}" />
      <button id="subutton" type="submit">Login</button>
    </form>
    <p className='errorMessage'>{message}</p>
  </div>
</div>
  );
}

export default LoginPage;
