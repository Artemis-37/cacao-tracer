import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Alert } from '@mui/material';
import { settingsAPI } from '../../services/api';

function ExporterSettings() {
  const [newExporter, setNewExporter] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExporter((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      await settingsAPI.createExporter(newExporter);
      setSuccess(true);
      setError('');
      setNewExporter({ name: '', contact_person: '', phone: '', email: '', address: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Exportateur ajouté avec succès!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
        <TextField
          label="Nom de l'exportateur"
          name="name"
          value={newExporter.name}
          onChange={handleChange}
        />
        <TextField
          label="Personne de contact"
          name="contact_person"
          value={newExporter.contact_person}
          onChange={handleChange}
        />
        <TextField
          label="Téléphone"
          name="phone"
          value={newExporter.phone}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          value={newExporter.email}
          onChange={handleChange}
        />
        <TextField
          label="Adresse"
          name="address"
          value={newExporter.address}
          onChange={handleChange}
          fullWidth
          sx={{ gridColumn: '1 / -1' }}
        />
      </Box>

      <Button
        variant="contained"
        color="success"
        onClick={handleCreate}
      >
        Ajouter un exportateur
      </Button>
    </Paper>
  );
}

export default ExporterSettings;
