import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Results.css';

const Results = () => {
    const navigate = useNavigate();
    const [currentColor, setCurrentColor] = useState('#e74c3c');
    const [isDrawing, setIsDrawing] = useState(false);
    const [markers, setMarkers] = useState([]);
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const [user, setUser] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [canvasReady, setCanvasReady] = useState(false);
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/');
            return;
        }
        setUser(JSON.parse(userData));

        const xrayImage = sessionStorage.getItem('xrayImage');
        if (!xrayImage) {
            navigate('/upload');
            return;
        }

        setImageData(xrayImage);
    }, [navigate]);

    useEffect(() => {
        if (imageData && imageRef.current) {
            imageRef.current.src = imageData;
        }
    }, [imageData]);

    const handleImageLoad = () => {
        setImageLoaded(true);
        setupCanvas();
    };

    const setupCanvas = () => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (canvas && img) {
            // Set canvas size to match image dimensions
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            
            // Scale canvas display size to match container
            const container = canvas.parentElement;
            const scale = Math.min(container.clientWidth / img.naturalWidth, container.clientHeight / img.naturalHeight);
            canvas.style.width = `${img.naturalWidth * scale}px`;
            canvas.style.height = `${img.naturalHeight * scale}px`;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = 3;
                setCanvasReady(true);

                // Add event listeners
                canvas.addEventListener('mousedown', startDrawing);
                canvas.addEventListener('mousemove', draw);
                canvas.addEventListener('mouseup', stopDrawing);
                canvas.addEventListener('mouseout', stopDrawing);
            }
        }
    };

    const selectColor = (color) => {
        const colorMap = {
            'red': '#e74c3c',
            'yellow': '#f1c40f',
            'green': '#2ecc71'
        };
        setCurrentColor(colorMap[color]);
    };

    const getCanvasCoordinates = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e) => {
        if (!canvasReady) return;
        setIsDrawing(true);
        const coords = getCanvasCoordinates(e);
        setMarkers(prev => [...prev, { color: currentColor, points: [coords] }]);
        drawMarkers();
    };

    const draw = (e) => {
        if (!isDrawing || !canvasReady) return;
        const coords = getCanvasCoordinates(e);
        setMarkers(prev => {
            const newMarkers = [...prev];
            newMarkers[newMarkers.length - 1].points.push(coords);
            return newMarkers;
        });
        drawMarkers();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const drawMarkers = () => {
        const canvas = canvasRef.current;
        if (!canvas || !canvasReady) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        markers.forEach(marker => {
            if (marker.points.length < 2) return;
            
            ctx.beginPath();
            ctx.moveTo(marker.points[0].x, marker.points[0].y);
            
            for (let i = 1; i < marker.points.length; i++) {
                ctx.lineTo(marker.points[i].x, marker.points[i].y);
            }
            
            ctx.strokeStyle = marker.color;
            ctx.stroke();
        });
    };

    const clearMarkers = () => {
        setMarkers([]);
        const canvas = canvasRef.current;
        if (!canvas || !canvasReady) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
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

            <div className="results-grid">
                <div className="xray-section">
                    <div className="image-container">
                        <img 
                            ref={imageRef} 
                            alt="Analyzed X-Ray" 
                            onLoad={handleImageLoad}
                            style={{ display: imageLoaded ? 'block' : 'none' }}
                        />
                        {imageLoaded && (
                            <canvas 
                                ref={canvasRef} 
                                className="marker-canvas"
                                style={{ 
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    touchAction: 'none'
                                }}
                            />
                        )}
                    </div>
                    <div className="marker-tools">
                        <div className="drawing-tools">
                            <button className={`tool-btn ${canvasReady ? 'active' : ''}`}>
                                <i className="fas fa-pen"></i> Pen
                            </button>
                            <div className="color-buttons">
                                <button 
                                    className={`color-btn ${currentColor === '#e74c3c' ? 'active' : ''}`}
                                    onClick={() => selectColor('red')}
                                    style={{ backgroundColor: '#e74c3c' }}
                                />
                                <button 
                                    className={`color-btn ${currentColor === '#f1c40f' ? 'active' : ''}`}
                                    onClick={() => selectColor('yellow')}
                                    style={{ backgroundColor: '#f1c40f' }}
                                />
                                <button 
                                    className={`color-btn ${currentColor === '#2ecc71' ? 'active' : ''}`}
                                    onClick={() => selectColor('green')}
                                    style={{ backgroundColor: '#2ecc71' }}
                                />
                            </div>
                        </div>
                        <button className="clear-btn" onClick={clearMarkers}>
                            <i className="fas fa-trash"></i> Clear Board
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
                        <button onClick={() => navigate('/upload')} className="new-scan-btn">
                            <i className="fas fa-camera"></i> New Scan
                        </button>
                        <button onClick={() => alert('Report download functionality will be implemented soon.')} className="download-btn">
                            <i className="fas fa-download"></i> Download Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results; 