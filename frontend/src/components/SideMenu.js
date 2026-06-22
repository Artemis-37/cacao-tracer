import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import BuildIcon from '@mui/icons-material/Build';
import StorageIcon from '@mui/icons-material/Storage';

const menuItems = [
  { label: 'Tableau de bord', icon: <DashboardIcon />, path: '/' },
  { label: 'Paramètres', icon: <SettingsIcon />, path: '/settings' },
  { label: 'Opérations', icon: <BuildIcon />, path: '/operations' },
  { label: 'Base de données', icon: <StorageIcon />, path: '/database' },
];

function SideMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          mt: 8,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          Menu
        </Typography>
      </Box>
      <Divider sx={{ background: 'rgba(255,255,255,0.2)' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                background: 'rgba(255,255,255,0.2)',
                '& .MuiListItemIcon-root': {
                  color: '#70ad47',
                },
                '& .MuiListItemText-primary': {
                  fontWeight: 'bold',
                },
              },
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default SideMenu;
