import { AppBar, Avatar, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { FC, useState } from 'react';

import { DRAWER_WIDTH } from '../utils/constants';
import { chatData } from '../types/chatData';
import { Settings } from '@mui/icons-material';
import SettingsModal from './Settings';

interface NavbarProps {
  handleDrawerToggle: () => void;
  currentChat: chatData;
}

const Navbar: FC<NavbarProps> = ({ handleDrawerToggle, currentChat }) => {
  const drawerWidth = DRAWER_WIDTH;
  const [open, setOpen] = useState(false);
  const avatarSrc = currentChat?.user.data().avatar || '';
  const displayName = currentChat?.user.data().displayName || '';

  return (
    <AppBar
      position='fixed'
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Avatar alt='Direct Messages' src={avatarSrc} />
        <Typography variant='h6' noWrap component='div' marginX={2}>
          {displayName}
        </Typography>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          onClick={() => setOpen(true)}
          size='large'
          sx={{
            position: 'absolute',
            right: 30,
          }}
        >
          <Settings />
        </IconButton>
      </Toolbar>
      <SettingsModal open={open} setOpen={setOpen} />
    </AppBar>
  );
};

export default Navbar;
