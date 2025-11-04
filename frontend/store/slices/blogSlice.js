import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchBlogs = createAsyncThunk(
    'blogs/fetchBlogs',
    async (filters = {}) => {
        const params = new URLSearchParams();
        
        // Only add params that have values
        if (filters.status) params.append('status', filters.status);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.page) params.append('page', filters.page);
        
        const queryString = params.toString();
        const url = queryString ? `${API_URL}/blogs?${queryString}` : `${API_URL}/blogs`;
        
        const response = await axios.get(url);
        return response.data;
    }
);

export const fetchBlogById = createAsyncThunk(
    'blogs/fetchBlogById',
    async (id) => {
        const response = await axios.get(`${API_URL}/blogs/${id}`);
        return response.data.data;
    }
);

export const fetchBlogBySlug = createAsyncThunk(
    'blogs/fetchBlogBySlug',
    async (slug) => {
        const response = await axios.get(`${API_URL}/blogs/slug/${slug}`);
        return response.data.data;
    }
);

export const createBlog = createAsyncThunk(
    'blogs/createBlog',
    async (blogData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/blogs`, blogData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateBlog = createAsyncThunk(
    'blogs/updateBlog',
    async ({ id, blogData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/blogs/${id}`, blogData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteBlog = createAsyncThunk(
    'blogs/deleteBlog',
    async (id) => {
        await axios.delete(`${API_URL}/blogs/${id}`);
        return id;
    }
);

const blogSlice = createSlice({
    name: 'blogs',
    initialState: {
        blogs: [],
        currentBlog: null,
        loading: false,
        error: null,
        pagination: null,
    },
    reducers: {
        clearCurrentBlog: (state) => {
            state.currentBlog = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch blogs
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload.data;
                state.pagination = action.payload.pagination || null;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Fetch blog by ID
            .addCase(fetchBlogById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBlogById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentBlog = action.payload;
            })
            .addCase(fetchBlogById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Fetch blog by slug
            .addCase(fetchBlogBySlug.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.currentBlog = action.payload;
            })
            .addCase(fetchBlogBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create blog
            .addCase(createBlog.fulfilled, (state, action) => {
                state.blogs.unshift(action.payload);
            })
            // Update blog
            .addCase(updateBlog.fulfilled, (state, action) => {
                const index = state.blogs.findIndex(blog => blog.id === action.payload.id);
                if (index !== -1) {
                    state.blogs[index] = action.payload;
                }
                state.currentBlog = action.payload;
            })
            // Delete blog
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.blogs = state.blogs.filter(blog => blog.id !== action.payload);
            });
    },
});

export const { clearCurrentBlog, clearError } = blogSlice.actions;
export default blogSlice.reducer;
