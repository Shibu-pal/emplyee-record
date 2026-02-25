import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Details() {
    const [item] = useState(() => {
        const selectedItem = localStorage.getItem('selectedItem');
        return selectedItem ? JSON.parse(selectedItem) : null;
    });
    const [showCamera, setShowCamera] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!item) {
            navigate('/list');
        }
    }, [navigate, item]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setShowCamera(true);
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Unable to access camera. Please ensure camera permissions are granted.');
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0);

            const imageData = canvas.toDataURL('image/png');
            localStorage.setItem('capturedPhoto', imageData);

            stopCamera();
            navigate('/photo');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowCamera(false);
    };

    const goBack = () => {
        navigate('/list');
    };

    if (!item) {
        return <div className="details-container">Loading...</div>;
    }

    return (
        <div className="details-container">
            <header className="details-header">
                <button className="btn btn-secondary" onClick={goBack}>
                    ← Back to List
                </button>
                <h1>Employee Details</h1>
            </header>

            <div className="details-content">
                <div className="details-card">
                    <div className="detail-avatar">
                        {item[0] ? item[0].charAt(0).toUpperCase() : '?'}
                    </div>

                    <div className="detail-grid">
                        <div className="detail-item">
                            <label>ID</label>
                            <span>{item[6]}</span>
                        </div>
                        <div className="detail-item">
                            <label>Name</label>
                            <span>{item[0]}</span>
                        </div>
                        <div className="detail-item">
                            <label>Position</label>
                            <span>{item[1]}</span>
                        </div>
                        <div className="detail-item">
                            <label>Office</label>
                            <span>{item[2]}</span>
                        </div>
                        <div className="detail-item">
                            <label>Extn.</label>
                            <span className="salary">{item[3]}</span>
                        </div>
                        <div className="detail-item">
                            <label>Start date</label>
                            <span>{item[4]}</span>
                        </div>
                        <div className="detail-item">
                            <label>Salary</label>
                            <span>{item[5]}</span>
                        </div>
                    </div>
                </div>

                <div className="camera-section">
                    <h2>📸 Capture Photo</h2>
                    <p>Take a photo to store with this employee record</p>

                    {!showCamera ? (
                        <button className="btn btn-primary btn-large" onClick={startCamera}>
                            Open Camera
                        </button>
                    ) : (
                        <div className="camera-preview">
                            <video ref={videoRef} autoPlay playsInline className="camera-video" />
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                            <div className="camera-actions">
                                <button className="btn btn-primary" onClick={capturePhoto}>
                                    📸 Capture
                                </button>
                                <button className="btn btn-danger" onClick={stopCamera}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Details;
