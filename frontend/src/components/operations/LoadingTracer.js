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
} from '@mui/material';
import { settingsAPI, operationsAPI } from '../../services/api';

function LoadingTracer() {
  const [step, setStep] = useState(1); // 1: Initial form, 2: Allocation params
  const [exporters, setExporters] = useState([]);
  const [projects, setProjects] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [showAllocations, setShowAllocations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const [loadingData, setLoadingData] = useState({
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

  const [allocationParams, setAllocationParams] = useState({
    delivery_start_date: '',
    delivery_end_date: '',
    delivery_percentage: 100,
    delivery_deadline_days: 30,
    min_sacks: 1,
    max_sacks: 10,
  });

  useEffect(() => {
    fetchExporters();
    fetchVehicles();
  }, []);

  const fetchExporters = async () => {
    try {
      const response = await settingsAPI.getExporters();
      setExporters(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des exportateurs');
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await settingsAPI.getVehicles();
      setVehicles(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des véhicules');
    }
  };

  const handleExporterChange = async (exporterId) => {
    setLoadingData((prev) => ({ ...prev, exporter_id: exporterId }));
    // Fetch projects for this exporter
    try {
      // API call to get projects
    } catch (err) {
      console.error('Erreur');
    }
  };

  const handleLoadingChange = (e) => {
    const { name, value } = e.target;
    setLoadingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllocationChange = (e) => {
    const { name, value } = e.target;
    setAllocationParams((prev) => ({
      ...prev,
      [name]: name === 'delivery_percentage' || name === 'delivery_deadline_days' || name === 'min_sacks' || name === 'max_sacks'
        ? parseInt(value)
        : value,
    }));
  };

  const handleCreateLoading = async () => {
    setLoading(true);
    try {
      const response = await operationsAPI.createLoading({
        ...loadingData,
        ...allocationParams,
      });
      setSuccess(true);
      setError('');
      setStep(2);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleAllocate = async () => {
    setLoading(true);
    setProgress(0);
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);

      // In real implementation, call allocate API
      // const response = await operationsAPI.allocateLoading(loadingId);
      // setAllocations(response.data.allocations);

      clearInterval(interval);
      setProgress(100);
      setSuccess(true);
      setError('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'allocation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Opération effectuée avec succès!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {step === 1 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            📦 Saisie des informations de chargement
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            <TextField
              select
              label="Exportateur"
              name="exporter_id"
              value={loadingData.exporter_id}
              onChange={(e) => handleExporterChange(e.target.value)}
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
              value={loadingData.project_id}
              onChange={handleLoadingChange}
              SelectProps={{ native: true }}
            >
              <option value="">Sélectionner...</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </TextField>

            <TextField
              label="Date de chargement"
              type="date"
              name="loading_date"
              value={loadingData.loading_date}
              onChange={handleLoadingChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="N° Véhicule"
              name="vehicle_number"
              value={loadingData.vehicle_number}
              onChange={handleLoadingChange}
            />

            <TextField
              label="N° Remorque"
              name="trailer_number"
              value={loadingData.trailer_number}
              onChange={handleLoadingChange}
            />

            <TextField
              label="Conducteur"
              name="driver_name"
              value={loadingData.driver_name}
              onChange={handleLoadingChange}
            />

            <TextField
              label="Connaissement"
              name="bill_of_lading"
              value={loadingData.bill_of_lading}
              onChange={handleLoadingChange}
            />

            <TextField
              label="Poids déclaré (kg)"
              type="number"
              name="declared_weight"
              value={loadingData.declared_weight}
              onChange={handleLoadingChange}
            />

            <TextField
              label="Nombre total de sacs"
              type="number"
              name="total_sacks"
              value={loadingData.total_sacks}
              onChange={handleLoadingChange}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleCreateLoading}
              disabled={loading}
            >
              Suivant →
            </Button>
          </Box>
        </Box>
      )}

      {step === 2 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            ⚙️ Paramètres d'affectation
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            <TextField
              label="Date de début de livraison"
              type="date"
              name="delivery_start_date"
              value={allocationParams.delivery_start_date}
              onChange={handleAllocationChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Date de fin de livraison"
              type="date"
              name="delivery_end_date"
              value={allocationParams.delivery_end_date}
              onChange={handleAllocationChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Pourcentage à affecter (%)"
              type="number"
              name="delivery_percentage"
              value={allocationParams.delivery_percentage}
              onChange={handleAllocationChange}
            />

            <TextField
              label="Délai de livraison (jours)"
              type="number"
              name="delivery_deadline_days"
              value={allocationParams.delivery_deadline_days}
              onChange={handleAllocationChange}
            />

            <TextField
              label="Min sacs par producteur"
              type="number"
              name="min_sacks"
              value={allocationParams.min_sacks}
              onChange={handleAllocationChange}
            />

            <TextField
              label="Max sacs par producteur"
              type="number"
              name="max_sacks"
              value={allocationParams.max_sacks}
              onChange={handleAllocationChange}
            />
          </Box>

          {progress > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                Progression: {progress}%
              </Typography>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleAllocate}
              disabled={loading}
            >
              🎯 Tracer
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => setShowAllocations(true)}
            >
              👁️ Voir la liste
            </Button>
            <Button
              variant="contained"
              color="primary"
            >
              ✅ Valider le chargement
            </Button>
            <Button
              variant="outlined"
              onClick={() => setStep(1)}
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
              <Button onClick={() => setShowAllocations(false)}>Fermer</Button>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: '#70ad47' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Producteur</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Poids alloué (kg)</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sacs</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date livraison</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allocations.map((alloc) => (
                      <TableRow key={alloc.id}>
                        <TableCell>{alloc.producer?.name}</TableCell>
                        <TableCell>{alloc.allocated_weight}</TableCell>
                        <TableCell>{alloc.allocated_sacks}</TableCell>
                        <TableCell>{alloc.delivery_date}</TableCell>
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
