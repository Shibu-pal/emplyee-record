import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PhotoResult() {
    const [photo, setPhoto] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const capturedPhoto = localStorage.getItem('capturedPhoto');
        if (capturedPhoto) {
            setPhoto(capturedPhoto);
        } else {
            navigate('/list');
        }
    }, [navigate]);

    const goBack = () => {
        navigate('/details');
    };

    const takeAnother = () => {
        navigate('/details');
    };

    if (!photo) {
        return <div className="photo-result-container">Loading...</div>;
    }

    return (
        <div className="photo-result-container">
            <header className="photo-result-header">
                <button className="btn btn-secondary" onClick={goBack}>
                    ← Back to Details
                </button>
                <h1>📸 Photo Captured</h1>
            </header>

            <div className="photo-content">
                <div className="photo-frame">
                    <img src={photo} alt="Captured" className="captured-photo" />
                </div>

                <div className="photo-info">
                    <p>Your photo has been captured successfully!</p>
                    <p className="photo-timestamp">
                        Captured at: {new Date().toLocaleString()}
                    </p>
                </div>

                <div className="photo-actions">
                    <button className="btn btn-primary btn-large" onClick={takeAnother}>
                        📸 Take Another Photo
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/list')}>
                        Back to List
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PhotoResult;
