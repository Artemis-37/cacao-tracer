import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { useState } from 'react';
import ExportData from '../components/database/ExportData';
import ImportData from '../components/database/ImportData';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`database-tabpanel-${index}`}
      aria-labelledby={`database-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function DatabasePage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        💾 Base de Données
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Importer" />
        <Tab label="Exporter" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <ImportData />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ExportData />
      </TabPanel>
    </Box>
  );
}

export default DatabasePage;
