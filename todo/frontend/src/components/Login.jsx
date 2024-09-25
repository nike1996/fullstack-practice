import React, { useState } from 'react';
import axios from 'axios';

const backendUrl = 'http://localhost:3001';

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
        <div>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={loginHandler}>
                <input id="email" type="text" placeholder="Email" />
                <input id="password" type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
