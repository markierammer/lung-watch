import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';
import logo from '../assets/Lung-watch-LOGO.png';

const Navigation = () => {
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = (e) => {
        e.preventDefault(); // Prevent default button behavior
        // Clear all storage
        localStorage.removeItem('user');
        sessionStorage.removeItem('xrayImage');
        // Update state
        setUser(null);
        setIsDropdownOpen(false);
        // Navigate to login
        navigate('/login', { replace: true });
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="nav-header">
            <div className="nav-content">
                <div className="nav-left">
                    <Link to="/" className="nav-logo">
                        <img src={logo} alt="Lung Watch Logo" className="logo" />
                        <span>Lung Watch</span>
                    </Link>
                </div>
                <div className="nav-center">
                    <Link to="/diseases" className="nav-link">Lung Diseases</Link>
                    <Link to="/about" className="nav-link">About Us</Link>
                </div>
                {user && (
                    <div className="nav-right">
                        <div className="profile-dropdown">
                            <button className="profile-button" onClick={toggleDropdown}>
                                <i className="fas fa-user-circle"></i>
                                <span>{user.name}</span>
                                <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                        <i className="fas fa-user"></i>
                                        My Profile
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-item">
                                        <i className="fas fa-sign-out-alt"></i>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation; 