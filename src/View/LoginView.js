
import React, { useState } from 'react';
import API from '../Utils/api.js';

function Login(props) {
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    console.log(username.value);
    API.post(`user/login`, {
        userName: username.value,
        userPassword: password.value
    }).then(response => {
        sessionStorage.setItem("username", username.value)
        sessionStorage.setItem("access_token",response.data.accessToken);
        props.history.push('/dashboard');
      }).catch(err => {setError("Login Failed")})
  }

  return (
    <div>
      Login<br /><br />
      <div>
        Username<br />
        <input type="text" {...username} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 15 }}>
        Password<br />
        <input type="password" {...password} autoComplete="new-password" />
      </div>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={'Login'} onClick={handleLogin} /><br />
      <a href="/register">register now!</a>
    </div>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Login;
