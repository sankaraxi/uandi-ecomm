import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchTestimonials = createAsyncThunk(
    'testimonials/fetchTestimonials',
    async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await axios.get(`${API_URL}/testimonials?${params}`);
        return response.data.data;
    }
);

export const fetchTestimonialById = createAsyncThunk(
    'testimonials/fetchTestimonialById',
    async (id) => {
        const response = await axios.get(`${API_URL}/testimonials/${id}`);
        return response.data.data;
    }
);

export const createTestimonial = createAsyncThunk(
    'testimonials/createTestimonial',
    async (testimonialData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/testimonials`, testimonialData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateTestimonial = createAsyncThunk(
    'testimonials/updateTestimonial',
    async ({ id, testimonialData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/testimonials/${id}`, testimonialData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteTestimonial = createAsyncThunk(
    'testimonials/deleteTestimonial',
    async (id) => {
        await axios.delete(`${API_URL}/testimonials/${id}`);
        return id;
    }
);

export const updateDisplayOrder = createAsyncThunk(
    'testimonials/updateDisplayOrder',
    async ({ id, display_order }) => {
        await axios.patch(`${API_URL}/testimonials/${id}/display-order`, { display_order });
        return { id, display_order };
    }
);

const testimonialSlice = createSlice({
    name: 'testimonials',
    initialState: {
        testimonials: [],
        currentTestimonial: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentTestimonial: (state) => {
            state.currentTestimonial = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch testimonials
            .addCase(fetchTestimonials.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTestimonials.fulfilled, (state, action) => {
                state.loading = false;
                state.testimonials = action.payload;
            })
            .addCase(fetchTestimonials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Fetch testimonial by ID
            .addCase(fetchTestimonialById.fulfilled, (state, action) => {
                state.currentTestimonial = action.payload;
            })
            // Create testimonial
            .addCase(createTestimonial.fulfilled, (state, action) => {
                state.testimonials.unshift(action.payload);
            })
            // Update testimonial
            .addCase(updateTestimonial.fulfilled, (state, action) => {
                const index = state.testimonials.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.testimonials[index] = action.payload;
                }
            })
            // Delete testimonial
            .addCase(deleteTestimonial.fulfilled, (state, action) => {
                state.testimonials = state.testimonials.filter(t => t.id !== action.payload);
            })
            // Update display order
            .addCase(updateDisplayOrder.fulfilled, (state, action) => {
                const index = state.testimonials.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.testimonials[index].display_order = action.payload.display_order;
                }
            });
    },
});

export const { clearCurrentTestimonial, clearError } = testimonialSlice.actions;
export default testimonialSlice.reducer;
