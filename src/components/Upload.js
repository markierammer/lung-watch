import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

const Upload = () => {
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState(null);
    const [cameraStream, setCameraStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/');
            return;
        }
        setUser(JSON.parse(userData));
    }, [navigate]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
                // Store the image data in sessionStorage
                sessionStorage.setItem('xrayImage', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPreviewImage(null);
        sessionStorage.removeItem('xrayImage');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.style.display = 'block';
            }
            document.getElementById('capture-photo').style.display = 'block';
        } catch (error) {
            alert("Error accessing camera: " + error);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = canvas.toDataURL('image/png');
            setCapturedImage(imageData);
            sessionStorage.setItem('xrayImage', imageData);
            
            // Stop the camera stream
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
                setCameraStream(null);
            }
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        sessionStorage.removeItem('xrayImage');
        openCamera();
    };

    const submitImage = () => {
        const imageToSubmit = previewImage || capturedImage;
        if (imageToSubmit) {
            navigate('/results');
        } else {
            alert('Please upload or capture an X-ray image first.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) {
        return null;
    }

    return (
        <div className="upload-page">
            <header className="upload-header">
                <div className="header-content">
                    <h1>Lung-Watch</h1>
                    <div className="user-section">
                        <span className="user-name">Welcome, {user.name}</span>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="upload-container">
                <div className="page-title">
                    <h2>X-Ray Analysis</h2>
                    <p>Upload or capture an X-Ray image for analysis</p>
                </div>

                <div className="scan-options">
                    <div className="scan-option">
                        <h2>Upload X-Ray Image</h2>
                        <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />
                            {previewImage ? (
                                <img src={previewImage} alt="X-ray Preview" className="preview-image" />
                            ) : (
                                <div className="upload-placeholder">
                                    <i className="fas fa-upload"></i>
                                    <p>Drop an Image <br /> or <br /> Click to Browse</p>
                                </div>
                            )}
                        </div>
                        {previewImage && (
                            <button className="action-btn remove-btn" onClick={removeImage}>
                                Remove Image
                            </button>
                        )}
                    </div>

                    <div className="scan-option">
                        <h2>Capture X-Ray Image</h2>
                        <div className="camera-box">
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                style={{ display: 'none' }}
                            />
                            <canvas 
                                ref={canvasRef} 
                                style={{ display: 'none' }}
                            />
                            {capturedImage ? (
                                <img src={capturedImage} alt="Captured X-ray" className="preview-image" />
                            ) : (
                                <div className="camera-placeholder" onClick={openCamera}>
                                    <i className="fas fa-camera"></i>
                                    <p>Click to Open Camera</p>
                                </div>
                            )}
                        </div>
                        <div className="camera-buttons">
                            {!capturedImage && (
                                <button className="action-btn capture-btn" onClick={capturePhoto}>
                                    <i className="fas fa-camera"></i> Capture Photo
                                </button>
                            )}
                            {capturedImage && (
                                <button className="action-btn retake-btn" onClick={retakePhoto}>
                                    <i className="fas fa-redo"></i> Retake Photo
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <button 
                    className="submit-btn" 
                    onClick={submitImage}
                    disabled={!previewImage && !capturedImage}
                >
                    Analyze Image
                </button>
            </main>
        </div>
    );
};

export default Upload; 