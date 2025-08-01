// File: redux/userSlice.ts
// CORRECTED: New Redux slice for managing users

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Role } from '@prisma/client';

export interface UserWithSchool extends User {
  assignedSchool?: {
    name: string;
  } | null;
}

interface UserState {
  users: UserWithSchool[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchUsersAsync = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch users');
      }
      const data = await response.json();
      return data as UserWithSchool[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUserAsync = createAsyncThunk(
  'users/create',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to create user');
      return data as UserWithSchool;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  'users/update',
  async (userData: { id: string } & Partial<User>, { rejectWithValue }) => {
    try {
      const { id, ...updateData } = userData;
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to update user');
      return data as UserWithSchool;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  'users/delete',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.error || 'Failed to delete user');
      }
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action: PayloadAction<UserWithSchool[]>) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createUserAsync.pending, (state) => { state.loading = true; })
      .addCase(createUserAsync.fulfilled, (state, action: PayloadAction<UserWithSchool>) => {
        state.users.unshift(action.payload);
        state.loading = false;
      })
      // Update
      .addCase(updateUserAsync.pending, (state) => { state.loading = true; })
      .addCase(updateUserAsync.fulfilled, (state, action: PayloadAction<UserWithSchool>) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.loading = false;
      })
      // Delete
      .addCase(deleteUserAsync.pending, (state) => { state.loading = true; })
      .addCase(deleteUserAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter(user => user.id !== action.payload);
        state.loading = false;
      })
      // Handle rejected cases for CUD operations
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string>) => {
          if(action.type !== fetchUsersAsync.rejected.type) {
            state.error = action.payload;
            state.loading = false;
          }
        }
      );
  },
});

export default userSlice.reducer;