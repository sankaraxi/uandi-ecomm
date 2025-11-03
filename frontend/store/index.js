import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import roleReducer from './roleSlice';
import categoriesReducer from './categoriesSlice';
import productsReducer from './productsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    roles: roleReducer,
    categories: categoriesReducer,
    products: productsReducer
  },
});