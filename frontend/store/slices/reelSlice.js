import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchReels = createAsyncThunk(
    'reels/fetchReels',
    async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await axios.get(`${API_URL}/reels?${params}`);
        return response.data.data;
    }
);

export const fetchReelsByProduct = createAsyncThunk(
    'reels/fetchReelsByProduct',
    async (productId) => {
        const response = await axios.get(`${API_URL}/reels/product/${productId}`);
        return response.data.data;
    }
);

export const fetchReelsByVariant = createAsyncThunk(
    'reels/fetchReelsByVariant',
    async (variantId) => {
        const response = await axios.get(`${API_URL}/reels/variant/${variantId}`);
        return response.data.data;
    }
);

export const fetchReelById = createAsyncThunk(
    'reels/fetchReelById',
    async (id) => {
        const response = await axios.get(`${API_URL}/reels/${id}`);
        return response.data.data;
    }
);

export const createReel = createAsyncThunk(
    'reels/createReel',
    async (reelData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/reels`, reelData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateReel = createAsyncThunk(
    'reels/updateReel',
    async ({ id, reelData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/reels/${id}`, reelData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteReel = createAsyncThunk(
    'reels/deleteReel',
    async (id) => {
        await axios.delete(`${API_URL}/reels/${id}`);
        return id;
    }
);

export const incrementViews = createAsyncThunk(
    'reels/incrementViews',
    async (id) => {
        await axios.post(`${API_URL}/reels/${id}/views`);
        return id;
    }
);

const reelSlice = createSlice({
    name: 'reels',
    initialState: {
        reels: [],
        currentReel: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentReel: (state) => {
            state.currentReel = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch reels
            .addCase(fetchReels.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReels.fulfilled, (state, action) => {
                state.loading = false;
                state.reels = action.payload;
            })
            .addCase(fetchReels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Fetch by product
            .addCase(fetchReelsByProduct.fulfilled, (state, action) => {
                state.reels = action.payload;
            })
            // Fetch by variant
            .addCase(fetchReelsByVariant.fulfilled, (state, action) => {
                state.reels = action.payload;
            })
            // Fetch by ID
            .addCase(fetchReelById.fulfilled, (state, action) => {
                state.currentReel = action.payload;
            })
            // Create reel
            .addCase(createReel.fulfilled, (state, action) => {
                state.reels.unshift(action.payload);
            })
            // Update reel
            .addCase(updateReel.fulfilled, (state, action) => {
                const index = state.reels.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.reels[index] = action.payload;
                }
            })
            // Delete reel
            .addCase(deleteReel.fulfilled, (state, action) => {
                state.reels = state.reels.filter(r => r.id !== action.payload);
            })
            // Increment views
            .addCase(incrementViews.fulfilled, (state, action) => {
                const index = state.reels.findIndex(r => r.id === action.payload);
                if (index !== -1) {
                    state.reels[index].views_count += 1;
                }
            });
    },
});

export const { clearCurrentReel, clearError } = reelSlice.actions;
export default reelSlice.reducer;
