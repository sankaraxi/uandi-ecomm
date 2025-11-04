import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import roleReducer from './roleSlice';
import categoriesReducer from './categoriesSlice';
import productsReducer from './productsSlice';
import blogReducer from './slices/blogSlice';
import testimonialReducer from './slices/testimonialSlice';
import reelReducer from './slices/reelSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    roles: roleReducer,
    categories: categoriesReducer,
    products: productsReducer,

    blogs: blogReducer,
        testimonials: testimonialReducer,
        reels: reelReducer,
  },
});