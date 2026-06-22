import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Alert } from '@mui/material';
import { settingsAPI } from '../../services/api';

function HarvestSeasonSettings() {
  const [seasons, setSeasons] = useState([]);
  const [newSeason, setNewSeason] = useState({
    name: '',
    type: 'grande_traite',
    start_date: '',
    end_date: '',
    delivery_percentage: 0,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSeason((prev) => ({
      ...prev,
      [name]: name === 'delivery_percentage' ? parseFloat(value) : value,
    }));
  };

  const handleCreate = async () => {
    try {
      await settingsAPI.createSeason(newSeason);
      setSuccess(true);
      setError('');
      setNewSeason({ name: '', type: 'grande_traite', start_date: '', end_date: '', delivery_percentage: 0 });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Traite créée avec succès!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
        <TextField
          label="Nom de la traite"
          value={newSeason.name}
          onChange={(e) => handleChange({ target: { name: 'name', value: e.target.value } })}
          placeholder="ex: Grande Traite"
        />
        <TextField
          select
          label="Type"
          name="type"
          value={newSeason.type}
          onChange={handleChange}
        />
        <TextField
          label="Date de début"
          type="date"
          value={newSeason.start_date}
          onChange={(e) => handleChange({ target: { name: 'start_date', value: e.target.value } })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Date de fin"
          type="date"
          value={newSeason.end_date}
          onChange={(e) => handleChange({ target: { name: 'end_date', value: e.target.value } })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Pourcentage de livraison"
          type="number"
          value={newSeason.delivery_percentage}
          onChange={(e) => handleChange({ target: { name: 'delivery_percentage', value: e.target.value } })}
        />
      </Box>

      <Button
        variant="contained"
        color="success"
        onClick={handleCreate}
      >
        Créer une traite
      </Button>
    </Paper>
  );
}

export default HarvestSeasonSettings;
