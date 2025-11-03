import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

// Fetch all users except customers
export const fetchUsers = createAsyncThunk("roles/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/roles/users`);
    return res.data;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Failed to Fetch Users",
      text: err.response?.data?.error || "Something went wrong",
    });
    return rejectWithValue(err.response?.data);
  }
});

// Fetch all roles
export const fetchRoles = createAsyncThunk("roles/fetchRoles", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/roles/roles`);
    return res.data;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Failed to Fetch Roles",
      text: err.response?.data?.error || "Something went wrong",
    });
    return rejectWithValue(err.response?.data);
  }
});

// Update user role
export const updateUserRole = createAsyncThunk(
  "roles/updateUserRole",
  async ({ userId, roleId }, { dispatch, rejectWithValue }) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/roles/users/role`, {
        userId,
        roleId,
      });

      Swal.fire({
        icon: "success",
        title: "Role Updated!",
        text: "User role has been updated successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      // Refresh data
      dispatch(fetchUsers());
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.error || "Something went wrong while updating role.",
      });
      return rejectWithValue(err.response?.data);
    }
  }
);


// Fetch customers (for assignment)
export const fetchCustomers = createAsyncThunk("roles/fetchCustomers", async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/roles/users?role=Customer`);
  return res.data;
});

// Assign customer as admin or super admin
export const assignMember = createAsyncThunk(
  "roles/assignMember",
  async ({ userId, roleId }, { dispatch, rejectWithValue }) => {
    try {
      Swal.fire({
        title: "Assigning Member...",
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
      });

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/roles/users/assign`, {
        userId,
        roleId,
      });

      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Member Assigned!",
        text: "The customer now has admin privileges.",
        timer: 2000,
        showConfirmButton: false,
      });

      dispatch(fetchUsers());
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Failed to Assign Member",
        text: err.response?.data?.error || "Something went wrong.",
      });
      return rejectWithValue(err.response?.data);
    }
  }
);

const roleSlice = createSlice({
  name: "roles",
  initialState: {
    users: [],
    roles: [],
    customers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customers = action.payload;
      });
  },
});

export default roleSlice.reducer;
