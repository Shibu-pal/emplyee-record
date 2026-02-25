import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function List() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const response = await fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'test',
                    password: '123456'
                })
            });

            const result = await response.json();

            if (result && result.TABLE_DATA.data) {
                setData(result.TABLE_DATA.data);
                console.log(result.TABLE_DATA.data)
            } else {
                // Try alternative response format
                setData(result.data || result);
                console.log(result)
            }
        } catch (err) {
            setError('Failed to fetch data. Please try again.');
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (item, index) => {
        item.push(index)
        localStorage.setItem('selectedItem', JSON.stringify(item));
        navigate('/details');
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('selectedItem');
        navigate('/login');
    };

    const handleBarGraph = () => {
        localStorage.setItem('employeeData', JSON.stringify(data));
        navigate('/bargraph');
    };

    const handleMap = () => {
        localStorage.setItem('employeeData', JSON.stringify(data));
        navigate('/map');
    };

    if (loading) {
        return (
            <div className="list-container">
                <div className="loading">Loading data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="list-container">
                <div className="error">{error}</div>
                <button onClick={fetchData}>Retry</button>
            </div>
        );
    }

    return (
        <div className="list-container">
            <header className="list-header">
                <h1>Employee Data</h1>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={handleBarGraph}>
                        📊 View Salary Chart
                    </button>
                    <button className="btn btn-secondary" onClick={handleMap}>
                        🗺️ View City Map
                    </button>
                    <button className="btn btn-danger" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Office</th>
                            <th>Extn.</th>
                            <th>Start date</th>
                            <th>Salary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index} onClick={() => handleRowClick(item, index + 1)}>
                                    <td>{index + 1}</td>
                                    <td>{item[0]}</td>
                                    <td>{item[1]}</td>
                                    <td>{item[2]}</td>
                                    <td>{item[3]}</td>
                                    <td>{item[4]}</td>
                                    <td>{item[5]}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default List;
