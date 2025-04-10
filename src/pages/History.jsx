import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function History() {
  const [predictions, setPredictions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      try {
        const res = await axios.get('/api/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPredictions(res.data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      }
    };
    fetchHistory();
  }, [navigate]);

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Prediction History
      </Typography>
      <Grid container spacing={3}>
        {predictions.map((pred, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={pred.imageUrl || 'https://via.placeholder.com/150'}
                alt="Predicted Image"
              />
              <CardContent>
                <Typography variant="h6">{pred.disease}</Typography>
                <Typography>Confidence: {pred.confidence}</Typography>
                <Typography>Date: {new Date(pred.timestamp).toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default History;