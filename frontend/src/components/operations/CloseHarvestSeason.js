import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Alert, Typography, Card, CardContent, Dialog } from '@mui/material';
import { operationsAPI } from '../../services/api';

function CloseHarvestSeason() {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeDialog, setActiveDialog] = useState(false);

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      const response = await operationsAPI.getHarvestSeasons();
      // Filtrer les traites ouvertes
      const openSeasons = response.data.filter((s) => s.is_active);
      setSeasons(openSeasons);
      // Auto-sélectionner la première si elle existe
      if (openSeasons.length > 0 && !selectedSeason) {
        setSelectedSeason(openSeasons[0]);
      }
    } catch (err) {
      setError('Erreur lors du chargement des traites');
    }
  };

  const handleCloseSeason = async () => {
    if (!selectedSeason) {
      setError('Veuillez sélectionner une traite');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await operationsAPI.closeHarvestSeason(selectedSeason.id);
      setSuccess(true);
      setError('');
      setSelectedSeason(null);
      setActiveDialog(false);
      fetchSeasons();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la fermeture de la traite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Traite fermée avec succès!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        🔒 Fermer une Traite
      </Typography>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Sélectionnez une traite ouverte et cliquez sur "Fermer" pour terminer la récolte.
      </Typography>

      {seasons.length === 0 ? (
        <Alert severity="info">Aucune traite ouverte actuellement. Veuillez d'abord ouvrir une traite.</Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
          {seasons.map((season) => (
            <Card
              key={season.id}
              sx={{
                cursor: 'pointer',
                border: selectedSeason?.id === season.id ? '2px solid #f57c00' : 'none',
                background: selectedSeason?.id === season.id ? '#fff3e0' : 'white',
              }}
              onClick={() => setSelectedSeason(season)}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {season.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Période: {new Date(season.start_date).toLocaleDateString('fr-FR')} -{' '}
                  {new Date(season.end_date).toLocaleDateString('fr-FR')}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Pourcentage: {season.delivery_percentage}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Ouverte le: {new Date(season.opened_at).toLocaleString('fr-FR')}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    p: 1,
                    borderRadius: 1,
                    background: '#e8f5e9',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#2e7d32',
                  }}
                >
                  ✅ OUVERTE
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={() => setActiveDialog(true)}
          disabled={!selectedSeason || loading}
        >
          🔒 Fermer la Traite
        </Button>
      </Box>

      {/* DIALOG DE CONFIRMATION */}
      <Dialog open={activeDialog} onClose={() => setActiveDialog(false)}>
        <Box sx={{ p: 3, minWidth: 400 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            ⚠️ Confirmer la fermeture
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Êtes-vous sûr de vouloir fermer la traite <strong>{selectedSeason?.name}</strong> ? Une fois
            fermée, vous ne pourrez plus créer de chargements pour cette traite.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setActiveDialog(false)}>
              Annuler
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseSeason}
              disabled={loading}
            >
              Confirmer la fermeture
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Paper>
  );
}

export default CloseHarvestSeason;
