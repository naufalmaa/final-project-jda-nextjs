// app/store/schoolSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { School } from '@/lib/types';

interface SchoolState {
  selected: School | null;
  loading: boolean;
  error: string | null;
}

const initialState: SchoolState = {
  selected: null,
  loading: true,
  error: null,
};

// Async Thunk to fetch a school by ID
export const fetchSchoolById = createAsyncThunk(
  'school/fetchById',
  async (schoolId: number, { rejectWithValue }) => {
    const res = await fetch(`/api/schools/${schoolId}`);
    if (!res.ok) {
      return rejectWithValue("Failed to fetch school details");
    }
    const schoolData = await res.json();
    return schoolData as School;
  }
);

// Async Thunk to update a school
export const updateSchoolAsync = createAsyncThunk(
  'school/updateSchool',
  async (schoolData: School, { rejectWithValue }) => {
    const res = await fetch(`/api/schools/${schoolData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schoolData),
    });
    if (!res.ok) {
      return rejectWithValue("Failed to update school");
    }
    const updatedSchool = await res.json();
    return updatedSchool as School;
  }
);

const schoolSlice = createSlice({
  name: 'school',
  initialState,
  reducers: {
    setSchool: (state, action: PayloadAction<School>) => {
      state.selected = action.payload;
    },
    clearSchool: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchSchoolById thunk
    builder
      .addCase(fetchSchoolById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchoolById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchSchoolById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Handle updateSchoolAsync thunk
    builder
      .addCase(updateSchoolAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchoolAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(updateSchoolAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSchool, clearSchool } = schoolSlice.actions;
export default schoolSlice.reducer;