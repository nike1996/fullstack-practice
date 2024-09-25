import React, { useState } from 'react';
import axios from 'axios';

const backendUrl = 'http://localhost:3001';

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

export default function Login() {
    const [error, setError] = useState(null);

    function loginHandler(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        axios.post(backendUrl + '/api/login', { email, password }, {
            withCredentials: true
        })
            .then((response) => {
                console.log(response.data);
                window.location.href = '/';
            })
            .catch((err) => {
                setError('Login failed. Please check your credentials and try again.');
                console.log(err);
            });
    }

    return (
        <div style={divStyle}>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={loginHandler} style={formStyle}>
                <input id="email" type="text" placeholder="Email" />
                <input id="password" type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
