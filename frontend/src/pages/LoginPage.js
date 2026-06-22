import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { authAPI } from '../services/api';
import { loginSuccess, loginFailure, setLoading } from '../redux/slices/authSlice';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@cacao-tracer.local');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.access_token,
      }));
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erreur de connexion';
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #70ad47 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#70ad47' }}>
                🌳 Cacao Tracer
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Système de traçabilité du cacao
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                disabled={loading}
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                disabled={loading}
                variant="outlined"
              />

              <Button
                fullWidth
                variant="contained"
                color="success"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Se connecter'}
              </Button>
            </Box>

            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
              Données de test :
              <br />
              Email: admin@cacao-tracer.local
              <br />
              Mot de passe: Admin@123
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default LoginPage;
