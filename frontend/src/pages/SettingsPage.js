import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { useState } from 'react';
import CooperativeSettings from '../components/settings/CooperativeSettings';
import CampaignSettings from '../components/settings/CampaignSettings';
import HarvestSeasonSettings from '../components/settings/HarvestSeasonSettings';
import ProducerSettings from '../components/settings/ProducerSettings';
import ExporterSettings from '../components/settings/ExporterSettings';
import VehicleSettings from '../components/settings/VehicleSettings';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function SettingsPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        ⚙️ Paramètres
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Société" />
        <Tab label="Campagne" />
        <Tab label="Traites" />
        <Tab label="Producteurs" />
        <Tab label="Exportateurs" />
        <Tab label="Véhicules" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <CooperativeSettings />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <CampaignSettings />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <HarvestSeasonSettings />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <ProducerSettings />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <ExporterSettings />
      </TabPanel>
      <TabPanel value={tabValue} index={5}>
        <VehicleSettings />
      </TabPanel>
    </Box>
  );
}

export default SettingsPage;
