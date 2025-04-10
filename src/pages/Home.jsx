import { useState, useRef, useEffect } from 'react';
import { Container, Typography, Button, Box, CardMedia } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Get user location with high-accuracy GPS for mobile
  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });
            console.log('GPS Location:', { lat: latitude, lng: longitude });
          },
          async (error) => {
            console.log('Geolocation denied:', error.message);
            // Fallback to IP-based location
            try {
              const res = await axios.get('http://ip-api.com/json');
              const { lat, lon } = res.data;
              setLocation({ lat, lng: lon });
              console.log('IP-based location:', { lat, lng: lon });
            } catch (err) {
              console.error('IP location fetch failed:', err);
              setLocation({ lat: 12.9716, lng: 77.5946 }); // Default: Bangalore
            }
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // GPS settings
        );
      } else {
        // Fallback for no geolocation support
        try {
          const res = await axios.get('http://ip-api.com/json');
          const { lat, lon } = res.data;
          setLocation({ lat, lng: lon });
          console.log('IP-based location:', { lat, lng: lon });
        } catch (err) {
          console.error('IP location fetch failed:', err);
          setLocation({ lat: 12.9716, lng: 77.5946 });
        }
      }
    };
    getLocation();
  }, []);

  // Start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use rear camera on mobile
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  // Capture image from camera
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' });
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      console.log('Captured image:', file);
      video.srcObject.getTracks().forEach(track => track.stop());
    }, 'image/jpeg');
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      console.log('Uploaded file:', file);
    }
  };

  // Detect disease
  const handleDetect = async () => {
    if (!image) {
      console.error('No image selected');
      return;
    }
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('location', JSON.stringify(location || { lat: 12.9716, lng: 77.5946 }));

    console.log('Sending FormData with image:', image, 'and location:', location);

    try {
      const res = await axios.post('/api/detect', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      setResult(res.data);
      console.log('API response:', res.data);
    } catch (err) {
      console.error('Detection failed:', err.response?.data || err.message);
    }
    setIsLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 3, px: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Disease Detection
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ width: '100%' }}
        />
        <Button 
          variant="outlined" 
          onClick={startCamera}
          size="large"
          sx={{ py: 1 }}
        >
          Start Camera
        </Button>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <video 
            ref={videoRef} 
            style={{ 
              width: '100%', 
              display: imagePreview ? 'none' : 'block',
              maxHeight: '50vh' 
            }} 
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {imagePreview && (
            <CardMedia
              component="img"
              image={imagePreview}
              alt="Captured or Uploaded Image"
              sx={{ width: '100%', maxHeight: '50vh', objectFit: 'contain' }}
            />
          )}
        </Box>
        <Button 
          variant="contained" 
          onClick={captureImage} 
          disabled={!videoRef.current?.srcObject}
          size="large"
          sx={{ py: 1 }}
        >
          Capture Image
        </Button>
        <Button 
          variant="contained" 
          onClick={handleDetect} 
          disabled={isLoading || !image}
          size="large"
          sx={{ py: 1 }}
        >
          {isLoading ? 'Detecting...' : 'Detect Disease'}
        </Button>
        {result && (
          <Typography variant="body1" align="center">
            Disease: {result.disease} (Confidence: {result.confidence.toFixed(2)})
          </Typography>
        )}
        {location && (
          <Typography variant="body2" align="center">
            Location: Lat {location.lat.toFixed(4)}, Lng {location.lng.toFixed(4)}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default Home;