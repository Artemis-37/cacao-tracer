import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Alert,
  Typography,
  LinearProgress,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { settingsAPI, operationsAPI } from '../../services/api';

function LoadingTracer() {
  const [activeStep, setActiveStep] = useState(0); // 0: Saisie initiale, 1: Paramètres allocation
  const [exporters, setExporters] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [showAllocations, setShowAllocations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLoadingId, setCurrentLoadingId] = useState(null);

  // ÉTAPE 1: SAISIE INITIALE
  const [saisieInitiale, setSaisieInitiale] = useState({
    exporter_id: '',
    project_id: '',
    loading_date: new Date().toISOString().split('T')[0],
    vehicle_number: '',
    trailer_number: '',
    driver_name: '',
    bill_of_lading: '',
    declared_weight: '',
    total_sacks: '',
  });

  // ÉTAPE 2: PARAMÈTRES D'ALLOCATION AUTOMATIQUE
  const [parametresAllocation, setParametresAllocation] = useState({
    delivery_start_date: '',
    delivery_end_date: '',
    delivery_percentage: 100,
    delivery_deadline_days: 30,
    min_sacks: 1,
    max_sacks: 10,
  });

  useEffect(() => {
    fetchExporters();
  }, []);

  const fetchExporters = async () => {
    try {
      const response = await settingsAPI.getExporters();
      setExporters(response.data);
    } catch (err) {
      console.error('Erreur exportateurs');
    }
  };

  const handleExporterChange = async (exporterId) => {
    setSaisieInitiale((prev) => ({ ...prev, exporter_id: exporterId }));
  };

  const handleSaisieChange = (e) => {
    const { name, value } = e.target;
    setSaisieInitiale((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllocationChange = (e) => {
    const { name, value } = e.target;
    setParametresAllocation((prev) => ({
      ...prev,
      [name]: ['delivery_percentage', 'delivery_deadline_days', 'min_sacks', 'max_sacks'].includes(name)
        ? parseInt(value)
        : value,
    }));
  };

  // ÉTAPE 1: Créer le chargement
  const handleCreerChargement = async () => {
    setLoading(true);
    try {
      const response = await operationsAPI.createLoading(saisieInitiale);
      setCurrentLoadingId(response.data.id);
      setSuccess(true);
      setError('');
      setActiveStep(1);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  // ÉTAPE 2: Affecter automatiquement
  const handleTracerChargement = async () => {
    setLoading(true);
    setProgress(0);
    try {
      // Simuler la progression
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 300);

      const response = await operationsAPI.allocateLoading(currentLoadingId, parametresAllocation);
      
      clearInterval(interval);
      setProgress(100);
      setAllocations(response.data.allocations);
      setSuccess(true);
      setError('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'allocation');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['📋 Saisie initiale', '⚙️ Paramètres d\'allocation', '✅ Validation'];

  return (
    <Paper sx={{ p: 3 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Opération effectuée avec succès!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* ÉTAPE 1: SAISIE INITIALE */}
      {activeStep === 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            📋 Saisie des informations de chargement
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            <TextField
              select
              label="Exportateur"
              name="exporter_id"
              value={saisieInitiale.exporter_id}
              onChange={handleSaisieChange}
              SelectProps={{ native: true }}
            >
              <option value="">Sélectionner...</option>
              {exporters.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.name}
                </option>
              ))}
            </TextField>

            <TextField
              select
              label="Projet"
              name="project_id"
              value={saisieInitiale.project_id}
              onChange={handleSaisieChange}
              SelectProps={{ native: true }}
            >
              <option value="">Sélectionner...</option>
            </TextField>

            <TextField
              label="Date de chargement"
              type="date"
              name="loading_date"
              value={saisieInitiale.loading_date}
              onChange={handleSaisieChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="N° Véhicule"
              name="vehicle_number"
              value={saisieInitiale.vehicle_number}
              onChange={handleSaisieChange}
            />

            <TextField
              label="N° Remorque"
              name="trailer_number"
              value={saisieInitiale.trailer_number}
              onChange={handleSaisieChange}
            />

            <TextField
              label="Conducteur"
              name="driver_name"
              value={saisieInitiale.driver_name}
              onChange={handleSaisieChange}
            />

            <TextField
              label="Connaissement"
              name="bill_of_lading"
              value={saisieInitiale.bill_of_lading}
              onChange={handleSaisieChange}
            />

            <TextField
              label="Poids déclaré (kg)"
              type="number"
              name="declared_weight"
              value={saisieInitiale.declared_weight}
              onChange={handleSaisieChange}
            />

            <TextField
              label="Nombre total de sacs"
              type="number"
              name="total_sacks"
              value={saisieInitiale.total_sacks}
              onChange={handleSaisieChange}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleCreerChargement}
              disabled={loading}
            >
              Suivant →
            </Button>
          </Box>
        </Box>
      )}

      {/* ÉTAPE 2: PARAMÈTRES D'ALLOCATION AUTOMATIQUE */}
      {activeStep === 1 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            ⚙️ Paramètres d'allocation automatique
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Configurez les paramètres pour l'allocation automatique du chargement aux producteurs.
            Le poids par sac sera calculé entre 55 et 75 kg.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            <TextField
              label="Période de livraison - Début"
              type="date"
              name="delivery_start_date"
              value={parametresAllocation.delivery_start_date}
              onChange={handleAllocationChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Période de livraison - Fin"
              type="date"
              name="delivery_end_date"
              value={parametresAllocation.delivery_end_date}
              onChange={handleAllocationChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Pourcentage à affecter (%)"
              type="number"
              name="delivery_percentage"
              value={parametresAllocation.delivery_percentage}
              onChange={handleAllocationChange}
              helperText="100 = affecter 100% du poids déclaré"
            />

            <TextField
              label="Délai de livraison (jours)"
              type="number"
              name="delivery_deadline_days"
              value={parametresAllocation.delivery_deadline_days}
              onChange={handleAllocationChange}
              helperText="Nombre de jours avant livraison"
            />

            <TextField
              label="Intervalle MIN de sacs"
              type="number"
              name="min_sacks"
              value={parametresAllocation.min_sacks}
              onChange={handleAllocationChange}
              helperText="Nombre minimum de sacs par producteur"
            />

            <TextField
              label="Intervalle MAX de sacs"
              type="number"
              name="max_sacks"
              value={parametresAllocation.max_sacks}
              onChange={handleAllocationChange}
              helperText="Nombre maximum de sacs par producteur"
            />
          </Box>

          {progress > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>
                Traçage en cours : {progress}%
              </Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleTracerChargement}
              disabled={loading}
              sx={{ minWidth: 150 }}
            >
              🔄 Tracer
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => setShowAllocations(true)}
              disabled={allocations.length === 0}
              sx={{ minWidth: 150 }}
            >
              👁️ Voir la liste
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={allocations.length === 0}
              sx={{ minWidth: 150 }}
            >
              ✅ Valider le chargement
            </Button>
            <Button
              variant="outlined"
              onClick={() => setActiveStep(0)}
              sx={{ minWidth: 150 }}
            >
              ← Retour
            </Button>
          </Box>

          <Dialog
            open={showAllocations}
            onClose={() => setShowAllocations(false)}
            maxWidth="md"
            fullWidth
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                📝 Liste des allocations
              </Typography>
              <Button
                onClick={() => setShowAllocations(false)}
                sx={{ mb: 2 }}
              >
                Fermer
              </Button>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: '#70ad47' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Producteur</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Poids (kg)</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sacs</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Poids/sac</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date livraison</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allocations.map((alloc) => (
                      <TableRow key={alloc.id}>
                        <TableCell>{alloc.producer?.name}</TableCell>
                        <TableCell>{alloc.allocated_weight.toFixed(2)}</TableCell>
                        <TableCell>{alloc.allocated_sacks}</TableCell>
                        <TableCell>{alloc.weight_per_sack?.toFixed(2)} kg</TableCell>
                        <TableCell>{new Date(alloc.delivery_date).toLocaleDateString('fr-FR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Dialog>
        </Box>
      )}
    </Paper>
  );
}

export default LoadingTracer;
