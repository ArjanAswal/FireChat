import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import logo from '/logo.jpeg';
import { useRef, useState } from 'react';
import { login, signup } from '../store/authSlice';
import { useAppDispatch } from '../store/hooks';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function Auth(): JSX.Element {
  enum AuthState {
    LOGIN = 'Login',
    SIGNUP = 'Sign Up',
    RESET_PASSWORD = 'Reset Password',
  }

  const [authState, setAuthState] = useState<AuthState>(AuthState.LOGIN);

  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);

  function handleInputChange() {
    // Clear the error when the user starts typing
    setError(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const { email, password, displayName } = {
      email: emailRef.current?.value.trim(),
      password: passwordRef.current?.value.trim(),
      displayName: displayNameRef.current?.value.trim(),
    };

    // validate email
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!email.includes('@')) {
      setError('Email is invalid');
      return;
    }

    if (authState !== AuthState.RESET_PASSWORD) {
      // validate password
      if (!password) {
        setError('Password is required');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    if (authState === AuthState.SIGNUP) {
      // validate display name
      if (!displayName) {
        setError('Display name is required');
        return;
      }

      if (displayName.length < 3) {
        setError('Display name must be at least 3 characters');
        return;
      }
    }

    let fn;

    switch (authState) {
      case AuthState.LOGIN:
        fn = dispatch(login(email, password!));
        break;

      case AuthState.SIGNUP:
        fn = dispatch(signup(email, password!, displayName!));
        break;

      default:
        fn = sendPasswordResetEmail(auth, email).then(() =>
          setError(
            'Password reset email has been sent. Please check your inbox.'
          )
        );

        break;
    }

    if (fn)
      fn.catch(error => setError(error.message)).finally(() =>
        setLoading(false)
      );
  }

  return (
    <>
      <Container
        component='main'
        maxWidth='xs'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Box
          component='form'
          border={1}
          borderRadius={5}
          bgcolor='background.paper'
          padding={10}
          display='flex'
          justifyContent='center'
          alignItems='center'
          flexDirection='column'
          gap={3}
          onSubmit={handleSubmit}
        >
          <Box textAlign='center' marginBottom={6}>
            <img src={logo} className='logo' alt='logo' width='120' />
            <Typography variant='h6'>Welcome to FireChat</Typography>
          </Box>

          <Box width={200}>
            <TextField
              required
              fullWidth
              onChange={handleInputChange}
              type='text'
              variant='standard'
              placeholder='Email'
              inputRef={emailRef}
            />
          </Box>

          {authState !== AuthState.RESET_PASSWORD && (
            <Box width={200}>
              <TextField
                required
                fullWidth
                onChange={handleInputChange}
                type='password'
                variant='standard'
                placeholder='Password'
                inputRef={passwordRef}
              />
            </Box>
          )}

          {authState === AuthState.SIGNUP && (
            <Box width={200}>
              <TextField
                required
                fullWidth
                onChange={handleInputChange}
                type='text'
                variant='standard'
                placeholder='Display Name'
                inputRef={displayNameRef}
              />
            </Box>
          )}

          {error && (
            <Box width={200}>
              <Typography variant='body1' color='error' textAlign='center'>
                {error}
              </Typography>
            </Box>
          )}

          <Box marginTop={error ? 0 : 6}>
            {loading ? (
              <CircularProgress size={26} />
            ) : (
              <Button type='submit' variant='contained' size='large' fullWidth>
                {authState === AuthState.LOGIN
                  ? 'Login'
                  : authState === AuthState.RESET_PASSWORD
                  ? 'Reset'
                  : 'Sign Up'}
              </Button>
            )}
          </Box>

          <Box>
            <Typography variant='subtitle1' textAlign='center'>
              {authState === AuthState.LOGIN
                ? "Don't have an account?"
                : 'Already have an account?'}
            </Typography>
            <Typography
              onClick={() => {
                setAuthState(
                  authState === AuthState.LOGIN
                    ? AuthState.SIGNUP
                    : AuthState.LOGIN
                );
                setError(null);
              }}
              textAlign='center'
              sx={{
                cursor: 'pointer',
                color: 'primary.main',
                fontWeight: 'bold',
              }}
            >
              {authState === AuthState.LOGIN ? 'Sign Up' : 'Login'}
            </Typography>
          </Box>

          {authState === AuthState.LOGIN && (
            <Box>
              <Typography variant='body2' textAlign='center'>
                Forgot your password?
              </Typography>
              <Typography
                variant='body2'
                onClick={() => setAuthState(AuthState.RESET_PASSWORD)}
                textAlign='center'
                sx={{
                  cursor: 'pointer',
                  color: 'primary.main',
                  fontWeight: 'bold',
                }}
              >
                Reset password
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}
