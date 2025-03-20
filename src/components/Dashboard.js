import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/');
            return;
        }
        setUser(JSON.parse(userData));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) {
        return null;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {user.name}!</h1>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
            
            <div className="dashboard-content">
                <div className="upload-section" onClick={() => navigate('/upload')}>
                    <h2>Upload X-Ray Image</h2>
                    <i className="fas fa-upload"></i>
                    <p>Click to upload or capture an X-Ray image</p>
                </div>
                
                <div className="camera-section" onClick={() => navigate('/upload')}>
                    <h2>Capture X-Ray</h2>
                    <i className="fas fa-camera"></i>
                    <p>Click to capture a new X-Ray image</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 