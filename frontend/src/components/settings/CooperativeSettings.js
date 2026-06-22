import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Alert } from '@mui/material';
import { settingsAPI } from '../../services/api';

function CooperativeSettings() {
  const [coop, setCoop] = useState({
    name: '',
    acronym: '',
    location: '',
    phone: '',
    email: '',
    website: '',
    description: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoop((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await settingsAPI.updateCooperative(coop);
      setSuccess(true);
      setError('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la sauvegarde');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Coopérative mise à jour avec succès!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <TextField
          label="Nom de la coopérative"
          name="name"
          value={coop.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Sigle"
          name="acronym"
          value={coop.acronym}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Localisation"
          name="location"
          value={coop.location}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Téléphone"
          name="phone"
          value={coop.phone}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={coop.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Site web"
          name="website"
          value={coop.website}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={coop.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ gridColumn: '1 / -1' }}
        />
      </Box>

      <Button
        variant="contained"
        color="success"
        onClick={handleSave}
        sx={{ mt: 2 }}
      >
        Enregistrer
      </Button>
    </Paper>
  );
}

export default CooperativeSettings;
