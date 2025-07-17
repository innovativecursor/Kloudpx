import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    LOADING: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { LOADING } = loadingSlice.actions;
export default loadingSlice.reducer;
