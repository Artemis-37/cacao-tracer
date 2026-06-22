import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Alert, Typography, Card, CardContent, Dialog } from '@mui/material';
import { operationsAPI } from '../../services/api';

function OpenHarvestSeason() {
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
      // Filtrer les traites fermées
      const closedSeasons = response.data.filter((s) => !s.is_active);
      setSeasons(closedSeasons);
    } catch (err) {
      setError('Erreur lors du chargement des traites');
    }
  };

  const handleOpenSeason = async () => {
    if (!selectedSeason) {
      setError('Veuillez sélectionner une traite');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await operationsAPI.openHarvestSeason({
        season_type: selectedSeason.type,
      });
      setSuccess(true);
      setError('');
      setSelectedSeason(null);
      setActiveDialog(false);
      fetchSeasons();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'ouverture de la traite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Traite ouverte avec succès!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        🌱 Ouvrir une Traite
      </Typography>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Sélectionnez une traite fermée et cliquez sur "Ouvrir" pour commencer la récolte.
      </Typography>

      {seasons.length === 0 ? (
        <Alert severity="info">Toutes les traites sont déjà ouvertes ou aucune traite n'est configurée.</Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
          {seasons.map((season) => (
            <Card
              key={season.id}
              sx={{
                cursor: 'pointer',
                border: selectedSeason?.id === season.id ? '2px solid #70ad47' : 'none',
                background: selectedSeason?.id === season.id ? '#f1f8f4' : 'white',
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
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    p: 1,
                    borderRadius: 1,
                    background: '#f5f5f5',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  Status: {season.status}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={() => setActiveDialog(true)}
          disabled={!selectedSeason || loading}
        >
          🔓 Ouvrir la Traite
        </Button>
      </Box>

      {/* DIALOG DE CONFIRMATION */}
      <Dialog open={activeDialog} onClose={() => setActiveDialog(false)}>
        <Box sx={{ p: 3, minWidth: 400 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            ⚠️ Confirmer l'ouverture
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Êtes-vous sûr de vouloir ouvrir la traite <strong>{selectedSeason?.name}</strong> ? Une fois
            ouverte, vous pourrez créer des chargements associés à cette traite.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setActiveDialog(false)}>
              Annuler
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleOpenSeason}
              disabled={loading}
            >
              Confirmer l'ouverture
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Paper>
  );
}

export default OpenHarvestSeason;
