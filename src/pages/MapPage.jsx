import { useEffect, useState } from 'react';
import { Container, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

function MapPage() {
  const [predictions, setPredictions] = useState([]);
  const [diseaseFilter, setDiseaseFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      const res = await axios.get('/api/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPredictions(res.data);
    };
    fetchHistory();
  }, [navigate]);

  const diseases = ['All', ...new Set(predictions.map((p) => p.disease))];
  const timeFrames = ['All', 'Last Week', 'Last Month', 'Last Year'];

  const filteredPredictions = predictions.filter((pred) => {
    const matchesDisease = diseaseFilter === 'All' || pred.disease === diseaseFilter;
    const now = new Date();
    const predDate = new Date(pred.timestamp);
    let matchesTime = true;
    if (timeFilter === 'Last Week') matchesTime = now - predDate <= 7 * 24 * 60 * 60 * 1000;
    else if (timeFilter === 'Last Month') matchesTime = now - predDate <= 30 * 24 * 60 * 60 * 1000;
    else if (timeFilter === 'Last Year') matchesTime = now - predDate <= 365 * 24 * 60 * 60 * 1000;
    return matchesDisease && matchesTime;
  });

  const markerIcon = (disease) =>
    new L.Icon({
      iconUrl: disease === 'Bacterial Blight' ? 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-red.png' : 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Disease Map
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Disease</InputLabel>
          <Select value={diseaseFilter} onChange={(e) => setDiseaseFilter(e.target.value)}>
            {diseases.map((disease) => (
              <MenuItem key={disease} value={disease}>
                {disease}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Frame</InputLabel>
          <Select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            {timeFrames.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <MapContainer center={[12.9716, 77.5946]} zoom={5} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredPredictions.map((pred, idx) => (
          pred.location && (
            <Marker
              key={idx}
              position={[pred.location.lat, pred.location.lng]}
              icon={markerIcon(pred.disease)}
            >
              <Popup>
                {pred.disease} - {new Date(pred.timestamp).toLocaleString()}
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </Container>
  );
}

export default MapPage;