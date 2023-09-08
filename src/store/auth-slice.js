import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
  isAuthenticated: false,
  currentUser: null,
  appliedJobs: [],
};

const authSlice = createSlice({
  name: 'authentication',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.currentUser = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.appliedJobs = [];
    },
    replaceAppliedJobs(state, action) {
      state.appliedJobs = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
