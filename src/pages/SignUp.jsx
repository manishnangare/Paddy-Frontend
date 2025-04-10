import { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('/api/signup', { email, password });
      if (res.status === 201) {
        const signInRes = await axios.post('/api/signin', { email, password });
        localStorage.setItem('token', signInRes.data.access_token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
      console.error('Signup failed:', err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Sign Up
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button variant="contained" onClick={handleSignUp}>
          Sign Up
        </Button>
        <Typography variant="body2" align="center">
          Already registered?{' '}
          <Button color="primary" onClick={() => navigate('/')}>
            Sign In
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}

export default SignUp;