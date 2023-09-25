import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Auth from './components/Auth';
import { useAppSelector } from './store/hooks';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import authSlice, { login } from './store/authSlice';
import { useDispatch } from 'react-redux';

function App() {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const dispatch = useDispatch();
  // Dark theme
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#7289da',
        dark: '#4b5e8c',
        light: '#99aab5',
        contrastText: '#fff',
      },
      secondary: {
        main: '#ffffff',
        dark: '#c2c2c2',
        light: '#ffffff',
        contrastText: '#000',
      },
      background: {
        paper: '#202225',
        default: '#18191c',
      },
      text: {
        primary: '#ffffff',
        secondary: '#b9bbbe',
        disabled: '#72767d',
      },
    },
    typography(palette) {
      return {
        h1: {
          fontSize: '4rem',
          fontWeight: 800,
          color: palette.text.primary,
        },
        h2: {
          fontSize: '3rem',
          fontWeight: 800,
          color: palette.text.primary,
        },
        h3: {
          fontSize: '2rem',
          fontWeight: 800,
          color: palette.text.primary,
        },
        h4: {
          fontSize: '1.5rem',
          fontWeight: 800,
          color: palette.text.primary,
        },
        h5: {
          fontSize: '1.25rem',
          fontWeight: 800,
          color: palette.text.primary,
        },
        h6: {
          fontSize: '1rem',
          fontWeight: 800,
          color: palette.text.primary,
        },
        subtitle1: {
          fontSize: '1rem',
          fontWeight: 400,
          color: palette.text.primary,
        },
        subtitle2: {
          fontSize: '0.875rem',
          fontWeight: 400,
          color: palette.text.primary,
        },
        body1: {
          fontSize: '1rem',
          fontWeight: 400,
          color: palette.text.primary,
        },
        body2: {
          fontSize: '0.875rem',
          fontWeight: 400,
          color: palette.text.primary,
        },
        button: {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: palette.text.primary,
        },
        caption: {
          fontSize: '0.75rem',
          fontWeight: 400,
          color: palette.text.primary,
        },
        overline: {
          fontSize: '0.625rem',
          fontWeight: 400,
          color: palette.text.primary,
        },
      };
    },
  });

  useEffect(() => {
    onAuthStateChanged(auth, userAuth => {
      if (userAuth) {
        // user is logged in, send the user's details to redux, store the current user in the state
        dispatch(authSlice.actions.login(userAuth));
      } else {
        dispatch(authSlice.actions.logout());
      }
    });
  }, [dispatch]);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {!isAuthenticated && <Auth />}
      </ThemeProvider>
    </>
  );
}

export default App;
