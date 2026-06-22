import React, { useState } from 'react';
import { Box, Button, Paper, Alert, CircularProgress } from '@mui/material';
import { databaseAPI } from '../../services/api';

function ExportData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async (type) => {
    setLoading(true);
    setError('');
    try {
      let response;
      let filename;

      if (type === 'producers') {
        response = await databaseAPI.exportProducers();
        filename = 'producteurs.xlsx';
      } else if (type === 'loadings') {
        response = await databaseAPI.exportLoadings();
        filename = 'chargements.xlsx';
      } else if (type === 'geojson') {
        response = await databaseAPI.exportGeoJSON();
        filename = 'producteurs.geojson';
      }

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'export');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleExport('producers')}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : '📊 Exporter Producteurs (Excel)'}
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleExport('loadings')}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : '📦 Exporter Chargements (Excel)'}
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleExport('geojson')}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : '🗺️ Exporter GeoJSON'}
        </Button>
      </Box>
    </Paper>
  );
}

export default ExportData;
