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
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';
import { DRAWER_WIDTH } from '../utils/constants';
import { chatData } from '../types/chatData';

interface NavbarProps {
  handleDrawerToggle: () => void;
  currentChat: chatData;
}

const Navbar: FC<NavbarProps> = ({ handleDrawerToggle, currentChat }) => {
  const drawerWidth = DRAWER_WIDTH;
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
        <Avatar alt='Direct Messages' src={currentChat?.user.data().image} />
        <Typography variant='h6' noWrap component='div' marginX={2}>
          {currentChat?.user.data().displayName}
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
