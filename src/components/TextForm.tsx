import { FC, useState } from 'react';

import { TextField, IconButton, Box } from '@mui/material';

import SendIcon from '@mui/icons-material/Send';

interface TextFormProps {
  onSubmit: (message: string) => void;
  drawerWidth: number;
}

const TextForm: FC<TextFormProps> = ({ onSubmit, drawerWidth }) => {
  const [message, setMessage] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(message);
    setMessage('');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 40,
        width: '80%',
      }}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label='Type your message here'
          value={message}
          onChange={handleChange}
          variant='filled'
          multiline={true}
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 2,
            margin: 2,
          }}
          InputProps={{
            endAdornment: (
              <IconButton type='submit' color='primary'>
                <SendIcon />
              </IconButton>
            ),
          }}
        />
      </form>
    </Box>
  );
};

export default TextForm;
