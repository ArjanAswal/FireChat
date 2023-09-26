import { Dispatch, PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export interface authState {
  isAuthenticated: boolean;
  user: User | null;
}

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    isAuthenticated: false,
    user: null,
  } as authState,
  reducers: {
    signup: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const signup = (
  email: string,
  password: string,
  displayName: string
) => {
  return async (dispatch: Dispatch) => {
    await createUserWithEmailAndPassword(auth, email, password).catch(() => {
      throw new Error('Invalid email or password');
    });
    const user = auth.currentUser;
    if (!user) throw new Error('User is null');

    await updateProfile(user, { displayName });

    //create user on firestore
    await setDoc(doc(db, 'users', user.uid), {
      displayName,
      displayNameCaseInsensitive: displayName.toLowerCase(),
      email,
    });

    dispatch(authSlice.actions.signup(user));
  };
};

export const login = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    await signInWithEmailAndPassword(auth, email, password).catch(() => {
      throw new Error('Invalid email or password');
    });
    const user = auth.currentUser;

    if (!user) throw new Error('User is null');

    dispatch(authSlice.actions.login(user));
  };
};

export const logout = () => {
  return async (dispatch: Dispatch) => {
    await signOut(auth);
    dispatch(authSlice.actions.logout());
  };
};

export default authSlice;
