import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import settingsReducer from './slices/settingsSlice';
import operationsReducer from './slices/operationsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    operations: operationsReducer,
  },
});

export default store;
