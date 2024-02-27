import { createSlice } from '@reduxjs/toolkit';

interface GoogleState {
  isGoogle: boolean;
}

const initialState: GoogleState = {
  isGoogle: false,
};

const googleSlice = createSlice({
  name: 'google',
  initialState,
  reducers: {
    googlelogin: state => {
      state.isGoogle = true;
    },
    googlelogout: state => {
      state.isGoogle = false;
    },
  },
});

export const { googlelogin, googlelogout } = googleSlice.actions;

export default googleSlice.reducer;
