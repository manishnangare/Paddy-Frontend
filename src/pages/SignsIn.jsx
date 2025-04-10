import { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const res = await axios.post('/api/signin', { email, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Sign-in failed'); 
      console.error('Sign-in failed:', err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Sign In
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button variant="contained" onClick={handleSignIn}>
          Sign In
        </Button>
        <Typography variant="body2" align="center">
          Not registered?{' '}
          <Button color="primary" onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}

export default SignIn;