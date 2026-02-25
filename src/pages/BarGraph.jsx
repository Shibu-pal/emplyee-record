import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Custom hook for getting window size
function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1024,
        height: typeof window !== 'undefined' ? window.innerHeight : 768
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}

function BarGraph() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const { width } = useWindowSize();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const employeeData = localStorage.getItem('employeeData');
        if (employeeData) {
            const parsedData = JSON.parse(employeeData);
            const chartData = parsedData.slice(0, 10).map((item, index) => ({
                id: index + 1,
                name: item[0],
                salary: parseInt(item[5].replace('$', '')),
                position: item[1]
            }));
            setData(chartData);
        }
    }, [navigate]);

    const goBack = () => {
        navigate('/list');
    };

    const chartHeight = width < 768 ? 300 : 500;
    const chartMargin = width < 768 ? { top: 20, right: 30, left: 20, bottom: 100 } : { top: 20, right: 30, left: 20, bottom: 60 };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${label}`}</p>
                    <p className="salary">{`Salary: $${payload[0].value.toLocaleString()}`}</p>
                    <p className="position">{`Position: ${payload[0].payload.position}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bargraph-container">
            <header className="bargraph-header">
                <button className="btn btn-secondary" onClick={goBack}>
                    ← Back to List
                </button>
                <h1>📊 Employee Salary Chart</h1>
            </header>

            <div className="bargraph-content">
                <div className="chart-description">
                    <h2>Top 10 Employees by Salary</h2>
                    <p>This bar graph displays the salaries of the first 10 employees from the database.</p>
                </div>

                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={chartHeight}>
                        <BarChart
                            data={data}
                            margin={chartMargin}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: '#fff', fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={80}
                            />
                            <YAxis
                                tick={{ fill: '#fff', fontSize: 12 }}
                                tickFormatter={(value) => `$${value.toLocaleString()}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar
                                dataKey="salary"
                                fill="#4ade80"
                                name="Salary ($)"
                                radius={[5, 5, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-stats">
                    {data.length > 0 && (
                        <>
                            <div className="stat-card">
                                <h3>Average Salary</h3>
                                <p>${Math.round(data.reduce((sum, item) => sum + item.salary, 0) / data.length).toLocaleString()}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Highest Salary</h3>
                                <p>${Math.max(...data.map(item => item.salary)).toLocaleString()}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Lowest Salary</h3>
                                <p>${Math.min(...data.map(item => item.salary)).toLocaleString()}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BarGraph;
