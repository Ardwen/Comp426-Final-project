import React, { useState } from 'react';
import API from '../Utils/api.js';

function Register(props) {
  const username = useFormInput('');
  const password = useFormInput('');
  const email = useFormInput('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    console.log(username.value)
      API.post(`user/register`, {
        userName: username.value,
        userEmail: email.value,
        userPassword: password.value
      })
    .then(response => {
          props.history.push('/');
    })
    .catch(err => setError("Register Failed. Username or email already exist"))
  }

  return (
    <div>
      Sign up<br /><br />
      <div>
        Username<br />
        <input type="text" {...username} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 15 }}>
        Email<br />
        <input type="email" {...email} autoComplete="new-email" />
      </div>
      <div style={{ marginTop: 15 }}>
        Password<br />
        <input type="password" {...password} autoComplete="new-password" />
      </div>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Sign Up'} onClick={handleRegister} disabled={loading} /><br />
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

export default Register;
