// app/store/reviewSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Review } from '@/app/lib/types';

interface ReviewState {
  reviews: Review[];
}

const initialState: ReviewState = {
  reviews: [], // initial kosong
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<Review>) => {
      state.reviews.push(action.payload);
    },
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
    },
    deleteReview: (state, action: PayloadAction<number>) => {
        state.reviews = state.reviews.filter((r) => r.id !== action.payload);
      }
    // tambahkan reducer lain jika perlu
  },
});

export default reviewSlice.reducer;
export const { addReview, setReviews, deleteReview } = reviewSlice.actions;
