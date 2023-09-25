import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { FC } from 'react';
import logo from '/logo.jpeg';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';

interface NavbarProps {
  drawerWidth: number;
  handleDrawerToggle: () => void;
}

const Navbar: FC<NavbarProps> = ({ drawerWidth, handleDrawerToggle }) => {
  const dispatch = useAppDispatch();

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
        <Avatar alt='Direct Messages' src={logo} />
        <Typography variant='h6' noWrap component='div' marginX={2}>
          Arjan Aswal
        </Typography>
      </Toolbar>

      <Button
        variant='contained'
        color='secondary'
        sx={{
          position: 'absolute',
          right: 20,
          top: 10,
          display: { xs: 'none', sm: 'block' },
        }}
        onClick={() => dispatch(logout())}
      >
        Logout
      </Button>
    </AppBar>
  );
};

export default Navbar;
