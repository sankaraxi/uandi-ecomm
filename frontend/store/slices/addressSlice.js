import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/address";

const initialState = {
    addresses: [],
    loading: false,
    error: null,
};

/**
 * 🟢 Fetch all addresses for a user
 */
export const fetchAddresses = createAsyncThunk(
    "addresses/fetchAddresses",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/address/user/${userId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

/**
 * 🟢 Add a new address
 */
export const addAddress = createAsyncThunk(
    "addresses/addAddress",
    async (addressData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/address`, addressData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

/**
 * 🟡 Update an existing address
 */
export const updateAddress = createAsyncThunk(
    "addresses/updateAddress",
    async ({ id, addressData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, addressData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

/**
 * 🔴 Delete an address
 */
export const deleteAddress = createAsyncThunk(
    "addresses/deleteAddress",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

const addressSlice = createSlice({
    name: "addresses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add
            .addCase(addAddress.fulfilled, (state, action) => {
                state.addresses.push(action.payload);
            })

            // Update
            .addCase(updateAddress.fulfilled, (state, action) => {
                const index = state.addresses.findIndex(
                    (address) => address.address_id === action.payload.address_id
                );
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
            })

            // Delete
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.addresses = state.addresses.filter(
                    (address) => address.address_id !== action.payload
                );
            });
    },
});

export default addressSlice.reducer;
