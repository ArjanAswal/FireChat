import * as React from 'react';
import Box from '@mui/material/Box';

import Chatbox from './Chatbox';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Home() {
  const drawerWidth = 240;

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Sidebar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        mobileOpen={mobileOpen}
      />

      <Chatbox drawerWidth={drawerWidth} />
    </Box>
  );
}
