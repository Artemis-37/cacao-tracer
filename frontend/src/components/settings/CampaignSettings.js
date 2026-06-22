import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { settingsAPI } from '../../services/api';

function CampaignSettings() {
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    start_date: '',
    end_date: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCampaign((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      await settingsAPI.createCampaign(newCampaign);
      setSuccess(true);
      setError('');
      setNewCampaign({ name: '', start_date: '', end_date: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Campagne créée avec succès!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
        <TextField
          label="Nom de la campagne"
          name="name"
          value={newCampaign.name}
          onChange={handleChange}
          placeholder="ex: 2026/2027"
        />
        <TextField
          label="Date de début"
          name="start_date"
          type="date"
          value={newCampaign.start_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Date de fin"
          name="end_date"
          type="date"
          value={newCampaign.end_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <Button
        variant="contained"
        color="success"
        onClick={handleCreate}
      >
        Créer une campagne
      </Button>
    </Paper>
  );
}

export default CampaignSettings;
