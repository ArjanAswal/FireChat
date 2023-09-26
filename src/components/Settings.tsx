import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import { FC, useRef, useState } from 'react';

interface SettingsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SettingsModal: FC<SettingsModalProps> = ({ open, setOpen }) => {
  const dispatch = useAppDispatch();
  const { user, userData } = useAppSelector(state => state.auth);
  const [image, setImage] = useState<File>();
  const [avatarSrc, setAvatarSrc] = useState<string>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (
        file.type !== 'image/png' &&
        file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg'
      ) {
        alert('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setAvatarSrc(reader.result as string);
      };
      reader.readAsDataURL(file);

      setImage(file);
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  function handleClose() {
    setOpen(false);
  }

  function handleSave() {
    setOpen(false);

    const displayNameValue = displayNameRef.current?.value.trim();

    if (displayNameValue) {
      updateDoc(doc(db, 'users', user!.uid), {
        displayName: displayNameValue,
        displayNameCaseInsensitive: displayNameValue.toLowerCase(),
      }).then(() => {});
    }

    if (image) {
      const formData = new FormData();
      formData.append('file', image);

      const storageRef = ref(
        storage,
        `users/${user?.uid}.${image.name.split('.').pop()}`
      );
      uploadBytes(storageRef, image);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>User Settings</DialogTitle>
      <DialogContent>
        <DialogContentText mb={5}>Update your user settings:</DialogContentText>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Avatar
            src={avatarSrc || userData?.avatar}
            defaultValue={userData?.avatar}
            sx={{ mb: 10, width: 150, height: 150, cursor: 'pointer' }}
            onClick={handleAvatarClick}
          />
          <input
            accept='image/*'
            id='avatar-upload'
            type='file'
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </Box>

        <TextField
          autoFocus
          margin='dense'
          id='displayName'
          label='Display Name'
          type='text'
          fullWidth
          defaultValue={userData?.displayName}
          inputRef={displayNameRef}
        />
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            position: 'absolute',
            left: 15,
          }}
          variant='outlined'
          onClick={() => dispatch(logout())}
        >
          Logout
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsModal;
