import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the AuthState type
type AuthState = {
  token: string | null;
  user: {
    _id?: string;
    id?: string; // in case the token has `id`
    token?: string;
    name?: string;
    email?: string;
    number?: string;
    role?: string;
    brandKey?: string;
    assignedBrandKeys?: string[];
    isBlock?: boolean;
  } | null;
  isAuthenticated: boolean;
};

const getFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const tokenFromStorage = getFromLocalStorage('token');
const userFromStorage = getFromLocalStorage('user');

const initialState: AuthState = {
  token: tokenFromStorage || null,
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  isAuthenticated: !!tokenFromStorage,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        token: string;
        _id: string;
        name: string;
        email: string;
        number: string;
        role: string;
        brandKey?: string;
        assignedBrandKeys?: string[];
        isBlock: boolean;
      }>
    ) => {
      const { token, _id, name, email, number, role, brandKey, assignedBrandKeys, isBlock } = action.payload;

      state.token = token;
      state.user = { _id, token, name, email, number, role, brandKey, assignedBrandKeys, isBlock };
      state.isAuthenticated = true;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
