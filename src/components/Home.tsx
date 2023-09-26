import Box from '@mui/material/Box';

import Chatbox from './Chatbox';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  DocumentData,
  addDoc,
  collection,
  documentId,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { useAppSelector } from '../store/hooks';
import { chatData } from '../types/chatData';

export default function Home() {
  const { user } = useAppSelector(state => state.auth);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatsData, setChatsData] = useState<chatData[]>([]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const selectChat = (chatData: chatData) => {
    const newChatsData = chatsData.map(chat => {
      return {
        ...chat,
        isSelected: false,
      };
    });

    newChatsData.find(chat => chat.chat.id === chatData.chat.id)!.isSelected =
      true;

    setChatsData(newChatsData);
  };

  const createChat = async (chatUser: DocumentData) => {
    if (chatsData.find(chat => chat.user.id === chatUser.id)) return;

    await addDoc(collection(db, 'chats'), {
      lastMessage: 'Say Hi!',
      lastMessageAt: serverTimestamp(),
      members: [chatUser.id, user!.uid],
    });
  };

  useEffect(() => {
    async function getChatsAndRelateToUsers() {
      onSnapshot(
        query(
          collection(db, 'chats'),
          where('members', 'array-contains', user?.uid)
        ),
        async docsSnap => {
          const chatObject = docsSnap.docs
            ?.map(doc => {
              return {
                chat: doc,
                user: doc
                  .data()
                  .members.filter((member: string) => member !== user?.uid)[0],
              };
            })
            .flat();

          if (!chatObject.length) return;

          const snapshot = await getDocs(
            query(
              collection(db, 'users'),
              where(
                documentId(),
                'in',
                chatObject.map(chat => chat.user)
              )
            )
          );

          const chatsDataObj = chatObject
            .map(chatObj => {
              const user = snapshot.docs.find(doc => doc.id === chatObj.user);
              return {
                chat: chatObj.chat,
                user: user!,
                isSelected: false,
              };
            })
            .sort(
              (a, b) =>
                b.chat.data().lastMessageAt - a.chat.data().lastMessageAt
            );
          chatsDataObj[0].isSelected = true;
          setChatsData(chatsDataObj);
        }
      );
    }
    getChatsAndRelateToUsers();
  }, [user]);

  const currentChat = chatsData.find(chat => chat.isSelected)!;

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar
        handleDrawerToggle={handleDrawerToggle}
        currentChat={currentChat}
      />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        selectChat={selectChat}
        createChat={createChat}
        chatsData={chatsData}
      />
      <Chatbox currentChat={currentChat} />
    </Box>
  );
}
