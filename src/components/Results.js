import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import './Results.css';

const Results = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState('#e74c3c');
    const [markers, setMarkers] = useState([]);
    const imageRef = useRef(null);
    const canvasRef = useRef(null);
    const currentPath = useRef([]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(userData));

        const xrayImage = sessionStorage.getItem('xrayImage');
        if (!xrayImage) {
            navigate('/upload');
            return;
        }

        const img = new Image();
        img.src = xrayImage;
        img.onload = () => {
            if (imageRef.current) {
                imageRef.current.src = xrayImage;
                setImageLoaded(true);
            }
        };
    }, [navigate]);

    useEffect(() => {
        if (imageLoaded) {
            setupCanvas();
        }
    }, [imageLoaded]);

    const setupCanvas = () => {
        if (!canvasRef.current || !imageRef.current) return;

        const canvas = canvasRef.current;
        const image = imageRef.current;
        
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        drawMarkers();
    };

    const getCanvasCoordinates = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (event) => {
        if (!canvasRef.current) return;
        
        event.preventDefault();
        const coords = getCanvasCoordinates(event);
        setIsDrawing(true);
        currentPath.current = [{ x: coords.x, y: coords.y }];
        
        window.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDrawing);
    };

    const draw = (event) => {
        if (!isDrawing || !canvasRef.current) return;
        
        event.preventDefault();
        const coords = getCanvasCoordinates(event);
        currentPath.current.push({ x: coords.x, y: coords.y });
        drawMarkers();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        
        setIsDrawing(false);
        if (currentPath.current.length > 1) {
            setMarkers([...markers, { 
                points: [...currentPath.current],
                color: currentColor
            }]);
        }
        currentPath.current = [];
        
        window.removeEventListener('mousemove', draw);
        window.removeEventListener('mouseup', stopDrawing);
    };

    const drawMarkers = () => {
        if (!canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        markers.forEach(marker => {
            if (marker.points.length < 2) return;
            
            ctx.beginPath();
            ctx.strokeStyle = marker.color;
            ctx.moveTo(marker.points[0].x, marker.points[0].y);
            
            for (let i = 1; i < marker.points.length; i++) {
                ctx.lineTo(marker.points[i].x, marker.points[i].y);
            }
            ctx.stroke();
        });
        
        if (currentPath.current.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = currentColor;
            ctx.moveTo(currentPath.current[0].x, currentPath.current[0].y);
            
            for (let i = 1; i < currentPath.current.length; i++) {
                ctx.lineTo(currentPath.current[i].x, currentPath.current[i].y);
            }
            ctx.stroke();
        }
    };

    const clearMarkers = () => {
        setMarkers([]);
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    const selectColor = (color) => {
        setCurrentColor(color);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) {
        return null;
    }

    return (
        <div className="results-container">
            <Navigation />
            <div className="results-grid">
                <div className="xray-section">
                    <div className="image-container">
                        <img 
                            ref={imageRef} 
                            alt="Analyzed X-Ray" 
                            style={{ display: imageLoaded ? 'block' : 'none' }}
                        />
                        {imageLoaded && (
                            <canvas 
                                ref={canvasRef} 
                                className="marker-canvas"
                                onMouseDown={startDrawing}
                            />
                        )}
                    </div>
                    <div className="drawing-tools">
                        <div className="color-buttons">
                            <button 
                                className={`color-button ${currentColor === '#e74c3c' ? 'active' : ''}`}
                                onClick={() => selectColor('#e74c3c')}
                                style={{ backgroundColor: '#e74c3c' }}
                            />
                            <button 
                                className={`color-button ${currentColor === '#f1c40f' ? 'active' : ''}`}
                                onClick={() => selectColor('#f1c40f')}
                                style={{ backgroundColor: '#f1c40f' }}
                            />
                            <button 
                                className={`color-button ${currentColor === '#2ecc71' ? 'active' : ''}`}
                                onClick={() => selectColor('#2ecc71')}
                                style={{ backgroundColor: '#2ecc71' }}
                            />
                        </div>
                        <button className="action-button clear" onClick={clearMarkers}>
                            Clear Board
                        </button>
                    </div>
                </div>
                <div className="analysis-section">
                    <div className="disease-detection">
                        <h2>DISEASE DETECTED</h2>
                        <div className="confidence-bars">
                            <div className="confidence-bar">
                                <span className="disease">BRONCHITIS</span>
                                <div className="bar-container">
                                    <div className="bar bronchitis" style={{ width: '95%' }}>95%</div>
                                </div>
                            </div>
                            <div className="confidence-bar">
                                <span className="disease">PNEUMONIA</span>
                                <div className="bar-container">
                                    <div className="bar pneumonia" style={{ width: '3%' }}>3%</div>
                                </div>
                            </div>
                            <div className="confidence-bar">
                                <span className="disease">ASTHMA</span>
                                <div className="bar-container">
                                    <div className="bar asthma" style={{ width: '2%' }}>2%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="analysis-summary">
                        <h3>ANALYSIS SUMMARY</h3>
                        <p className="summary-text">
                            High likelihood of Bronchitis detected. Review of the lower right lung region is recommended.
                        </p>
                    </div>
                    <div className="action-buttons">
                        <button onClick={() => navigate('/upload')} className="action-button">
                            New Scan
                        </button>
                        <button className="action-button download">
                            Download Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results; 