import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';  // We'll reuse the login styles

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        license_number: '',
        name: '',
        password: '',
        confirm_password: ''
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (formData.password !== formData.confirm_password) {
            setMessage('Passwords do not match');
            setIsError(true);
            return;
        }

        try {
            console.log('Attempting to register with:', {
                license_number: formData.license_number,
                name: formData.name,
                password: formData.password
            });

            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    license_number: formData.license_number,
                    name: formData.name,
                    password: formData.password
                })
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (data.success) {
                setMessage('Registration successful! Redirecting to login...');
                setIsError(false);
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setMessage(data.message || 'Registration failed. Please try again.');
                setIsError(true);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage('An error occurred. Please make sure the server is running.');
            setIsError(true);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Register</h2>
                {message && (
                    <div className={`message ${isError ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="license_number">License Number</label>
                        <input
                            type="text"
                            id="license_number"
                            name="license_number"
                            value={formData.license_number}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
                <p className="register-link">
                    Already have an account? <a href="/">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default Register; 