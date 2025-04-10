import { useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Logged Out
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You have been successfully logged out.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Sign In Again
      </Button>
    </Container>
  );
}

export default Logout;