import { Box } from '@mui/material';
import { FC } from 'react';
import Chats from './Chat';
import TextForm from './TextForm';
import { DRAWER_WIDTH } from '../utils/constants';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAppSelector } from '../store/hooks';
import { chatData } from '../types/chatData';

interface ChatboxProps {
  currentChat: chatData;
}

const Chatbox: FC<ChatboxProps> = ({ currentChat }) => {
  const { user } = useAppSelector(state => state.auth);

  const drawerWidth = DRAWER_WIDTH;

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
      <Chats currentChat={currentChat} />

      <TextForm
        onSubmit={async (message: string) => {
          await Promise.all([
            addDoc(collection(db, 'chats', currentChat.chat.id, 'messages'), {
              text: message,
              createdAt: serverTimestamp(),
              sender: user?.uid,
            }),

            updateDoc(doc(db, 'chats', currentChat.chat.id), {
              lastMessage: message,
              lastMessageAt: serverTimestamp(),
            }),
          ]);
        }}
      />
    </Box>
  );
};

export default Chatbox;
