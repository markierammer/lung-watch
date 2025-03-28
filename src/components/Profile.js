import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        title: 'Dr.',  // Default title
        licenseNumber: '',
        email: '',
        specialization: '',
        hospital: ''
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
            name: parsedUser.name || '',
            title: parsedUser.title || 'Dr.',  // Use existing title or default to Dr.
            licenseNumber: parsedUser.license_number || '',
            email: parsedUser.email || '',
            specialization: parsedUser.specialization || '',
            hospital: parsedUser.hospital || ''
        });
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedUser = {
            ...user,
            name: formData.name,
            title: formData.title,
            license_number: formData.licenseNumber,
            email: formData.email,
            specialization: formData.specialization,
            hospital: formData.hospital
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
    };

    const getDisplayName = () => {
        if (!user) return '';
        return `${user.title || 'Dr.'} ${user.name}`;
    };

    if (!user) {
        return null;
    }

    return (
        <div className="profile-container">
            <Navigation />
            <div className="profile-content">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-header-info">
                            <div className="profile-avatar">
                                <i className="fas fa-user-circle"></i>
                            </div>
                            <div className="profile-info-container">
                                <h1 className="profile-name">{getDisplayName()}</h1>
                                {!isEditing && (
                                    <button 
                                        className="edit-button"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <i className="fas fa-edit"></i>
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group">
                                <label>Title</label>
                                <select
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="title-select"
                                >
                                    <option value="Dr.">Dr.</option>
                                    <option value="MD">MD</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>License Number</label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Hospital/Clinic</label>
                                <input
                                    type="text"
                                    name="hospital"
                                    value={formData.hospital}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-buttons">
                                <button type="submit" className="save-button">
                                    Save Changes
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <div className="info-group">
                                <label>License Number</label>
                                <p>{user.license_number}</p>
                            </div>
                            <div className="info-group">
                                <label>Email</label>
                                <p>{user.email || 'Not provided'}</p>
                            </div>
                            <div className="info-group">
                                <label>Specialization</label>
                                <p>{user.specialization || 'Not provided'}</p>
                            </div>
                            <div className="info-group">
                                <label>Hospital/Clinic</label>
                                <p>{user.hospital || 'Not provided'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile; 