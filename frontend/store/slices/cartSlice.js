
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const getUserId = () => {
  if (typeof window === 'undefined') return null;
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.user_id || null;
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState }) => {
  const token = getAuthToken();
  if (token) {
    const userId = getUserId();
    const { data } = await axios.get(`${API_URL}/cart/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.items;
  } else {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (item, { dispatch }) => {
  const token = getAuthToken();
  if (token) {
    const userId = getUserId();
    await axios.post(`${API_URL}/cart`, { ...item, user_id: userId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } else {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(i => i.product_id === item.product_id && i.variant_id === item.variant_id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  dispatch(fetchCart());
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (item, { dispatch }) => {
  const token = getAuthToken();
  if (token) {
    await axios.delete(`${API_URL}/cart/${item.variant_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } else {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(i => i.variant_id !== item.variant_id);
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  dispatch(fetchCart());
});

export const updateCartItemQuantity = createAsyncThunk('cart/updateCartItemQuantity', async ({ variant_id, quantity }, { dispatch }) => {
  const token = getAuthToken();
  if (token) {
    await axios.put(`${API_URL}/cart/${variant_id}`, { quantity }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } else {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.variant_id === variant_id);
    if (item) {
      item.quantity = quantity;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  dispatch(fetchCart());
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { dispatch }) => {
    const token = getAuthToken();
    if (token) {
        const userId = getUserId();
        await axios.delete(`${API_URL}/cart/clear/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } else {
        localStorage.removeItem('cart');
    }
    dispatch(fetchCart());
});

export const mergeCarts = createAsyncThunk('cart/mergeCarts', async (_, { dispatch }) => {
  const token = getAuthToken();
  const localCart = JSON.parse(localStorage.getItem('cart')) || [];
  if (token && localCart.length > 0) {
    const userId = getUserId();
    // Assuming the backend has a merge endpoint, if not, this will fail.
    // You might need to add this endpoint to your backend.
    // For now, we will add items one by one.
    for (const item of localCart) {
        await axios.post(`${API_URL}/cart`, { ...item, user_id: userId }, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
    localStorage.removeItem('cart');
  }
  dispatch(fetchCart());
});


const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    isOpen: false,
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(mergeCarts.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { openCart, closeCart } = cartSlice.actions;

export default cartSlice.reducer;
