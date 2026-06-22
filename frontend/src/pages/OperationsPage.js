import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { useState } from 'react';
import ReceiptNotebook from '../components/operations/ReceiptNotebook';
import LoadingTracer from '../components/operations/LoadingTracer';
import OpenHarvestSeason from '../components/operations/OpenHarvestSeason';
import CloseHarvestSeason from '../components/operations/CloseHarvestSeason';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`operations-tabpanel-${index}`}
      aria-labelledby={`operations-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function OperationsPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        📋 Opérations
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Ouvrir une traite" />
        <Tab label="Fermer une traite" />
        <Tab label="Carnet de Reçu" />
        <Tab label="Tracer un Chargement" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <OpenHarvestSeason />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <CloseHarvestSeason />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <ReceiptNotebook />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <LoadingTracer />
      </TabPanel>
    </Box>
  );
}

export default OperationsPage;
