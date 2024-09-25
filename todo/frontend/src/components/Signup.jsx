import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendUrl = 'http://localhost:3001';

export default function Signup() {
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const divStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '10px'
  }

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: '10px',
    padding: '10px'
  }

  async function Signup(e) {
    e.preventDefault();
    const name = document.getElementById('nameId').value;
    const email = document.getElementById('emailId').value;
    const password = document.getElementById('passwordId').value;
    if (name === '' || email === '' || password === '') {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.post(backendUrl + '/api/signup', { name, email, password }, {
        withCredentials: true
      });
      if (response.data.error) {
        setError(response.data.error);
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError('Failed to signup');
    }
  }

  return (
    <div style={divStyle}>
      <h1>Signup</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form style={formStyle} onSubmit={Signup}>
        <input id='nameId' type="text" placeholder="Name" />
        <input id='emailId' type="text" placeholder="Email" />
        <input id='passwordId' type="password" placeholder="Password" />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
