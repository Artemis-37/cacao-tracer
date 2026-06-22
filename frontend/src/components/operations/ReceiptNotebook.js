import React, { useState } from 'react';
import { Box, Button, Paper, Typography, Alert } from '@mui/material';

function ReceiptNotebook() {
  const [receipts, setReceipts] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  return (
    <Paper sx={{ p: 3 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Opération effectuée avec succès!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="h6" sx={{ mb: 2 }}>
        📔 Carnet de Reçu
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Button
          variant="contained"
          color="success"
          size="large"
        >
          Générer un Reçu
        </Button>
        <Button
          variant="outlined"
          color="success"
          size="large"
        >
          Voir l'Historique
        </Button>
      </Box>
    </Paper>
  );
}

export default ReceiptNotebook;
