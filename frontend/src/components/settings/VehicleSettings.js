import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Alert } from '@mui/material';
import { settingsAPI } from '../../services/api';

function VehicleSettings() {
  const [newVehicle, setNewVehicle] = useState({
    registration_number: '',
    vehicle_type: '',
    driver_name: '',
    driver_phone: '',
    capacity_kg: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      await settingsAPI.createVehicle(newVehicle);
      setSuccess(true);
      setError('');
      setNewVehicle({ registration_number: '', vehicle_type: '', driver_name: '', driver_phone: '', capacity_kg: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Véhicule ajouté avec succès!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
        <TextField
          label="N° d'immatriculation"
          name="registration_number"
          value={newVehicle.registration_number}
          onChange={handleChange}
        />
        <TextField
          label="Type de véhicule"
          name="vehicle_type"
          value={newVehicle.vehicle_type}
          onChange={handleChange}
          placeholder="Camion, Remorque, etc."
        />
        <TextField
          label="Nom du chauffeur"
          name="driver_name"
          value={newVehicle.driver_name}
          onChange={handleChange}
        />
        <TextField
          label="Téléphone du chauffeur"
          name="driver_phone"
          value={newVehicle.driver_phone}
          onChange={handleChange}
        />
        <TextField
          label="Capacité (kg)"
          name="capacity_kg"
          type="number"
          value={newVehicle.capacity_kg}
          onChange={handleChange}
        />
      </Box>

      <Button
        variant="contained"
        color="success"
        onClick={handleCreate}
      >
        Ajouter un véhicule
      </Button>
    </Paper>
  );
}

export default VehicleSettings;
