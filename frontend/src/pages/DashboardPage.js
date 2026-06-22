import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from '@mui/material';

function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducers: 0,
    totalLoadings: 0,
    totalWeight: 0,
    completedLoadings: 0,
  });

  useEffect(() => {
    // Mock data for now
    setStats({
      totalProducers: 124,
      totalLoadings: 42,
      totalWeight: 125680,
      completedLoadings: 38,
    });
  }, []);

  const StatCard = ({ title, value, color }) => (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        📊 Tableau de Bord
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Producteurs" value={stats.totalProducers} color="#1976d2" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Chargements" value={stats.totalLoadings} color="#70ad47" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Poids Total (kg)" value={stats.totalWeight.toLocaleString()} color="#f57c00" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Chargements Complétés" value={stats.completedLoadings} color="#388e3c" />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Statistiques Mensuelles
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <Typography color="textSecondary">Graphique à charger depuis l'API</Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default DashboardPage;
