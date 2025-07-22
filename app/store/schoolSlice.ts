// app/store/schoolSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { School } from '@/app/lib/types';

interface SchoolState {
  selected: School | null;
}

const initialState: SchoolState = {
  selected: null,
};

const schoolSlice = createSlice({
  name: 'school',
  initialState,
  reducers: {
    setSchool: (state, action: PayloadAction<School>) => {
      state.selected = action.payload;
    },
    updateSchool: (state, action: PayloadAction<Partial<School>>) => {
      if (state.selected) {
        state.selected = { ...state.selected, ...action.payload };
      }
    },
    clearSchool: (state) => {
      state.selected = null;
    },
  },
});

export const { setSchool, updateSchool, clearSchool } = schoolSlice.actions;
export default schoolSlice.reducer;
