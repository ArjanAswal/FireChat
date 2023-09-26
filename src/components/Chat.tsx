import { Box, Paper, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { chatData } from '../types/chatData';
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../firebase';

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

interface ChatsProps {
  currentChat: chatData;
}

const Chats: FC<ChatsProps> = ({ currentChat }) => {
  const { user } = useAppSelector(state => state.auth);
  const [messages, setMessages] = useState<
    {
      id: string;
      data: DocumentData;
    }[]
  >([]);

  useEffect(() => {
    if (currentChat) {
      onSnapshot(
        query(
          collection(db, 'chats', currentChat?.chat?.id, 'messages'),
          orderBy('createdAt', 'asc')
        ),
        docsSnap => {
          setMessages(
            docsSnap.docs.map(doc => {
              return {
                id: doc.id,
                data: doc.data(),
              };
            })
          );
        }
      );
    }
  }, [currentChat]);

  return (
    <Box
      component='main'
      sx={{
        flexGrow: 1,
        p: 1,
      }}
    >
      {messages?.map(message => {
        return (
          <Chat
            key={message.id}
            message={message.data.text}
            isSent={message.data.sender === user?.uid}
          />
        );
      })}
    </Box>
  );
};

export default Chats;
