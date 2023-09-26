import { FC } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';
import { DRAWER_WIDTH } from '../utils/constants';
import { chatData } from '../types/chatData';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { useState } from 'react';
import Popover from '@mui/material/Popover';
import ChatIcon from '@mui/icons-material/Chat';
import {
  DocumentData,
  query,
  collection,
  getDocs,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAppSelector } from '../store/hooks';
interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  selectChat: (user: chatData) => void;
  createChat: (user: DocumentData) => void;
  chatsData: chatData[];
}

const Sidebar: FC<SidebarProps> = ({
  mobileOpen,
  handleDrawerToggle,
  selectChat,
  createChat,
  chatsData,
}) => {
  const drawerWidth = DRAWER_WIDTH;

  const [searchResults, setSearchResults] = useState<DocumentData[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const { user } = useAppSelector(state => state.auth);

  const doSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value.toLowerCase();

    if (searchQuery === '') {
      setSearchResults([]);
      setAnchorEl(null);
      return;
    }
    setAnchorEl(event.currentTarget);

    const results = (
      await getDocs(
        query(
          collection(db, 'users'),
          where('displayNameCaseInsensitive', '>=', searchQuery),
          where('displayNameCaseInsensitive', '<=', searchQuery + '\uf7ff')
        )
      )
    ).docs.filter(doc => doc.id !== user?.uid) as DocumentData[];

    setSearchResults(results);

    if (!results.length) setAnchorEl(null);
  };

  const handleClose = () => {
    setSearchResults([]);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const popover = (
    <Popover
      id='search-results'
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      disableAutoFocus
      sx={{
        '& .MuiPaper-root': {
          width: drawerWidth - 50,
        },
      }}
    >
      <List>
        {searchResults.map(result => (
          <ListItem key={result.id} disablePadding>
            <ListItemButton
              onClick={() => {
                createChat(result);
                handleClose();
              }}
            >
              <Avatar
                alt={result.data().displayName}
                src={result.data().avatar}
              />
              <Box marginLeft={2}>
                <Typography variant='body1' fontWeight={600}>
                  {result.data().displayName}
                </Typography>
              </Box>
              <ChatIcon
                sx={{
                  marginLeft: 'auto',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Popover>
  );

  const drawer = (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'background.paper',
            p: 1,
            borderRadius: 2,
          }}
        >
          <SearchIcon sx={{ mr: 1 }} />
          <InputBase
            placeholder='Search…'
            inputProps={{ 'aria-label': 'search' }}
            sx={{ ml: 1, flex: 1 }}
            onChange={doSearch}
          />
        </Box>
      </Box>
      <Divider />
      {popover}
      <List>
        {chatsData?.map(chatData => (
          <ListItem key={chatData.chat.id} disablePadding>
            <ListItemButton
              onClick={() => {
                selectChat(chatData);
              }}
            >
              <Avatar alt='Direct Messages' src={chatData.user.data().avatar} />
              <Box marginLeft={2}>
                <Typography variant='body1' fontWeight={600}>
                  {chatData.user.data().displayName}
                </Typography>
                <Typography variant='body2' fontStyle={'italic'}>
                  {chatData.chat.data().lastMessage}
                </Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component='nav'
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label='mailbox folders'
    >
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Drawer
          variant='permanent'
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Sidebar;
