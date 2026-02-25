import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import BarGraph from './pages/BarGraph';
import Details from './pages/Details';
import List from './pages/List';
import Login from './pages/Login';
import MapPage from './pages/MapPage';
import PhotoResult from './pages/PhotoResult';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/list" element={<List />} />
        <Route path="/details" element={<Details />} />
        <Route path="/photo" element={<PhotoResult />} />
        <Route path="/bargraph" element={<BarGraph />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
