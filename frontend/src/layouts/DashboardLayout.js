import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Box, Container, AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import SideMenu from '../components/SideMenu';

function DashboardLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu />
      <Box sx={{ flex: 1 }}>
        <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg, #1976d2 0%, #70ad47 100%)' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bold' }}>
              🌳 Cacao Tracer
            </Typography>
            <Button
              color="inherit"
              onClick={handleMenuOpen}
            >
              {user?.email}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default DashboardLayout;
