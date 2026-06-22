import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import { settingsAPI } from '../../services/api';

function ProducerSettings() {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProducer, setNewProducer] = useState({
    name: '',
    phone: '',
    email: '',
    village: '',
    latitude: '',
    longitude: '',
    estimated_production: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducers();
  }, []);

  const fetchProducers = async () => {
    setLoading(true);
    try {
      const response = await settingsAPI.getProducers();
      setProducers(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProducer((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      await settingsAPI.createProducer(newProducer);
      setSuccess(true);
      setError('');
      setNewProducer({ name: '', phone: '', email: '', village: '', latitude: '', longitude: '', estimated_production: '' });
      fetchProducers();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Producteur ajouté avec succès!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
        <TextField
          label="Nom du producteur"
          name="name"
          value={newProducer.name}
          onChange={handleChange}
        />
        <TextField
          label="Téléphone"
          name="phone"
          value={newProducer.phone}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          value={newProducer.email}
          onChange={handleChange}
        />
        <TextField
          label="Village"
          name="village"
          value={newProducer.village}
          onChange={handleChange}
        />
        <TextField
          label="Latitude"
          name="latitude"
          type="number"
          value={newProducer.latitude}
          onChange={handleChange}
        />
        <TextField
          label="Longitude"
          name="longitude"
          type="number"
          value={newProducer.longitude}
          onChange={handleChange}
        />
        <TextField
          label="Production estimée (kg)"
          name="estimated_production"
          type="number"
          value={newProducer.estimated_production}
          onChange={handleChange}
        />
      </Box>

      <Button
        variant="contained"
        color="success"
        onClick={handleCreate}
        sx={{ mb: 3 }}
      >
        Ajouter un producteur
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#70ad47' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nom</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Village</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Téléphone</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Production estimée (kg)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {producers.map((producer) => (
                <TableRow key={producer.id}>
                  <TableCell>{producer.name}</TableCell>
                  <TableCell>{producer.village}</TableCell>
                  <TableCell>{producer.phone}</TableCell>
                  <TableCell>{producer.estimated_production}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

export default ProducerSettings;
