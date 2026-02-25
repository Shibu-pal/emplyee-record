import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icon
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapPage() {
    const [locations, setLocations] = useState([]);
    const [center, setCenter] = useState([20.5937, 78.9629]); // Default: India
    const navigate = useNavigate();

    const getRandomCoords = () => {
        return [
            Math.random() * 60 - 30,
            Math.random() * 360 - 180
        ];
    };

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const employeeData = localStorage.getItem('employeeData');
        if (employeeData) {
            const parsedData = JSON.parse(employeeData);

            // Extract unique cities and their counts
            const cityCounts = {};
            parsedData.forEach(item => {
                const city = item[2];
                if (city) {
                    cityCounts[city] = (cityCounts[city] || 0) + 1;
                }
            });

            // Map cities to coordinates (sample coordinates for major cities)
            const cityCoordinates = {
                'Edinburgh': [55.9533, -3.1883],
                'Tokyo': [35.6762, 139.6503],
                'San Francisco': [37.7749, -122.4194],
                'New York': [40.7128, -74.0060],
                'London': [51.5074, -0.1278],
                'Sidney': [-33.8688, 151.2093], // Usually spelled 'Sydney' in datasets
                'Singapore': [1.3521, 103.8198]
            };

            const locationData = Object.entries(cityCounts).map(([city, count]) => {
                const coords = cityCoordinates[city] || getRandomCoords();
                return {
                    city,
                    count,
                    position: coords
                };
            });

            setLocations(locationData);

            // Calculate center based on locations
            if (locationData.length > 0) {
                const avgLat = locationData.reduce((sum, loc) => sum + loc.position[0], 0) / locationData.length;
                const avgLng = locationData.reduce((sum, loc) => sum + loc.position[1], 0) / locationData.length;
                setCenter([avgLat, avgLng]);
            }
        }
    }, [navigate]);

    const goBack = () => {
        navigate('/list');
    };

    return (
        <div className="map-container">
            <header className="map-header">
                <button className="btn btn-secondary" onClick={goBack}>
                    ← Back to List
                </button>
                <h1>🗺️ Employee Locations</h1>
            </header>

            <div className="map-content">
                <div className="map-description">
                    <h2>Employee Distribution by City</h2>
                    <p>This map shows the distribution of employees across different cities.</p>
                </div>

                <div className="map-wrapper">
                    <MapContainer
                        center={center}
                        zoom={2}
                        style={{ height: '500px', width: '100%', borderRadius: '12px' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {locations.map((loc, index) => (
                            <Marker key={index} position={loc.position}>
                                <Popup>
                                    <div className="city-popup">
                                        <h3>{loc.city}</h3>
                                        <p><strong>Employees:</strong> {loc.count}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                <div className="city-list">
                    <h3>City Summary</h3>
                    <div className="city-grid">
                        {locations.map((loc, index) => (
                            <div key={index} className="city-card">
                                <span className="city-name">{loc.city}</span>
                                <span className="city-count">{loc.count} employee{loc.count > 1 ? 's' : ''}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MapPage;
