import { Box } from '@mui/material';
import { FC } from 'react';
import Chats from './Chat';
import TextForm from './TextForm';

interface ChatboxProps {
  drawerWidth: number;
}

const Chatbox: FC<ChatboxProps> = ({ drawerWidth }) => {
  return (
    <Box
      component='main'
      sx={{
        flexGrow: 1,
        p: 3,
        mt: 5,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Chats />

      <TextForm onSubmit={() => {}} drawerWidth={drawerWidth} />
    </Box>
  );
};

export default Chatbox;
