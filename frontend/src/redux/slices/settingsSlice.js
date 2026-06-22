import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cooperative: null,
  campaigns: [],
  seasons: [],
  producers: [],
  exporters: [],
  vehicles: [],
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCooperative(state, action) {
      state.cooperative = action.payload;
    },
    setCampaigns(state, action) {
      state.campaigns = action.payload;
    },
    setSeasons(state, action) {
      state.seasons = action.payload;
    },
    setProducers(state, action) {
      state.producers = action.payload;
    },
    setExporters(state, action) {
      state.exporters = action.payload;
    },
    setVehicles(state, action) {
      state.vehicles = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setCooperative,
  setCampaigns,
  setSeasons,
  setProducers,
  setExporters,
  setVehicles,
  setLoading,
  setError,
} = settingsSlice.actions;

export default settingsSlice.reducer;
