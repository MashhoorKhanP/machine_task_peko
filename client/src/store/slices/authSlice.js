import { createSlice } from "@reduxjs/toolkit";
const storedUserInfo = localStorage.getItem('userLoggedIn');
const parsedUserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

const initialState = {
  userLoggedIn: parsedUserInfo,
  currentUser: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.userLoggedIn = true;
      state.currentUser = action.payload;
      localStorage.setItem('userLoggedIn', JSON.stringify(action.payload));
    },
    setLoggedOut: (state) => {
      state.userLoggedIn = false;
      localStorage.removeItem('userLoggedIn');
    }
  }
});

export const { setLogin, setLoggedOut } = authSlice.actions;
export default authSlice.reducer;