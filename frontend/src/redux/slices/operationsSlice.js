import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loadings: [],
  currentLoading: null,
  allocations: [],
  receipts: [],
  loading: false,
  error: null,
};

const operationsSlice = createSlice({
  name: 'operations',
  initialState,
  reducers: {
    setLoadings(state, action) {
      state.loadings = action.payload;
    },
    setCurrentLoading(state, action) {
      state.currentLoading = action.payload;
    },
    setAllocations(state, action) {
      state.allocations = action.payload;
    },
    setReceipts(state, action) {
      state.receipts = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    resetError(state) {
      state.error = null;
    },
  },
});

export const {
  setLoadings,
  setCurrentLoading,
  setAllocations,
  setReceipts,
  setLoading,
  setError,
  resetError,
} = operationsSlice.actions;

export default operationsSlice.reducer;
