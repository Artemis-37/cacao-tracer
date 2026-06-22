import React, { useState } from 'react';
import { Box, Button, Paper, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { databaseAPI } from '../../services/api';

function ImportData() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    try {
      const response = await databaseAPI.importProducers(file);
      setSuccess(true);
      setError('');
      setFile(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'import');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Données importées avec succès!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 3 }}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ marginRight: '10px' }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={handleImport}
        >
          Importer Producteurs (CSV)
        </Button>
      </Box>

      <Alert severity="info">
        Format CSV attendu : name, phone, email, village, latitude, longitude, estimated_production, is_active
      </Alert>
    </Paper>
  );
}

export default ImportData;
