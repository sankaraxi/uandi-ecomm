import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Fetch attributes for a product
export const fetchProductAttributes = createAsyncThunk(
  'productAttributes/fetch',
  async (productId) => {
    const res = await fetch(`${API_URL}/products/${productId}/attributes`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to load attributes');
    return data.data; // expected { attribute_id, product_id, key_ingredients, know_about_product, benefits }
  }
);

// Create attributes
export const createProductAttributes = createAsyncThunk(
  'productAttributes/create',
  async (payload) => {
    const { product_id, key_ingredients, know_about_product, benefits } = payload;
    const res = await fetch(`${API_URL}/products/${product_id}/attributes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id, key_ingredients, know_about_product, benefits })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to create attributes');
    return { ...payload, attribute_id: data.attribute_id };
  }
);

// Update attributes
export const updateProductAttributes = createAsyncThunk(
  'productAttributes/update',
  async ({ attribute_id, data: update }) => {
    const res = await fetch(`${API_URL}/products/attributes/${attribute_id}` , {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to update attributes');
    return { attribute_id, ...update };
  }
);

// Delete attributes
export const deleteProductAttributes = createAsyncThunk(
  'productAttributes/delete',
  async (attribute_id) => {
    const res = await fetch(`${API_URL}/products/attributes/${attribute_id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete attributes');
    return attribute_id;
  }
);

const productAttributesSlice = createSlice({
  name: 'productAttributes',
  initialState: {
    item: null,
    loading: false,
    error: null
  },
  reducers: {
    clearProductAttributes: (state) => { state.item = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductAttributes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProductAttributes.fulfilled, (state, action) => { state.loading = false; state.item = action.payload; })
      .addCase(fetchProductAttributes.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createProductAttributes.fulfilled, (state, action) => { state.item = action.payload; })
      .addCase(updateProductAttributes.fulfilled, (state, action) => {
        if (state.item && state.item.attribute_id === action.payload.attribute_id) {
          state.item = { ...state.item, ...action.payload };
        } else {
          state.item = action.payload;
        }
      })
      .addCase(deleteProductAttributes.fulfilled, (state, action) => {
        if (state.item && state.item.attribute_id === action.payload) {
          state.item = null;
        }
      });
  }
});

export const { clearProductAttributes } = productAttributesSlice.actions;
export default productAttributesSlice.reducer;
