import { Box, Paper, Typography } from '@mui/material';
import { FC } from 'react';

interface ChatProps {
  message: string;
  isSent: boolean;
}

const Chat: FC<ChatProps> = ({ message, isSent }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isSent ? 'flex-end' : 'flex-start',
        mb: 1,
      }}
    >
      <Paper
        sx={{
          p: 1,
          backgroundColor: isSent ? 'primary.main' : 'background.paper',
          color: isSent ? 'background.paper' : 'text.primary',
        }}
      >
        <Typography variant='body1'>{message}</Typography>
      </Paper>
    </Box>
  );
};

interface ChatsProps {}

const Chats: FC<ChatsProps> = () => {
  return (
    <Box
      component='main'
      sx={{
        flexGrow: 1,
        p: 1,
      }}
    >
      <Chat message='Hello!' isSent={false} />
      <Chat message='Hi there!' isSent={true} />
      <Chat message='How are you?' isSent={false} />
      <Chat message='How are you?' isSent={false} />
      <Chat message='Hi there!' isSent={true} />
      <Chat message='How are you?' isSent={false} />
      <Chat message='Hi there!' isSent={true} />
      <Chat message='How are you?' isSent={false} />
      <Chat message='Hi there!' isSent={true} />
      <Chat message='Hi there!' isSent={true} />
      <Chat message='How are you?' isSent={false} />
      <Chat message='Hi there!' isSent={true} />
      <Chat message='How are you?' isSent={false} />
      <Chat message='Hi there!' isSent={true} />
      <Chat message='How are you?' isSent={false} />
      <Chat message='Hi there!' isSent={true} />
      <Chat message='How are you?' isSent={false} />
      <Chat message='I am doing well, thanks for asking!' isSent={true} />
    </Box>
  );
};

export default Chats;
