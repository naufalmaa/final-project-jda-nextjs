// app/store/reviewSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Review } from '@prisma/client';

export interface ReviewWithUser extends Review {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null; // Optional user image
  };
}

interface ReviewState {
  reviews: ReviewWithUser[];
  loading: boolean;
  error: string | null;
}

// CORRECTED: Set initial loading state to 'true' to show skeleton on first render
const initialState: ReviewState = {
  reviews: [],
  loading: true, 
  error: null,
};

// Async Thunk to fetch reviews for a school
export const fetchReviewsBySchoolId = createAsyncThunk(
  'review/fetchBySchoolId',
  async (schoolId: number, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/reviews?schoolId=${schoolId}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response' }));
        return rejectWithValue(errorData.error || "Failed to fetch reviews");
      }
      const reviewsData = await res.json();
      return reviewsData as ReviewWithUser[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async Thunk to create a new review
export const createReviewAsync = createAsyncThunk(
  'review/createReview',
  async (newReviewData: any, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReviewData),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response' }));
        return rejectWithValue(errorData.error || "Failed to create review");
      }
      const createdReview = await res.json();
      return createdReview as ReviewWithUser;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const updateReviewAsync = createAsyncThunk(
  'review/updateReview',
  async ({ reviewId, reviewData }: { reviewId: number; reviewData: any }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response' }));
        return rejectWithValue(errorData.error || "Failed to update review");
      }
      const updatedReview = await res.json();
      return updatedReview as ReviewWithUser;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async Thunk to delete a review
export const deleteReviewAsync = createAsyncThunk(
  'review/deleteReview',
  async (reviewId: number, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response' }));
        return rejectWithValue(errorData.error || "Failed to delete review");
      }
      return reviewId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
  
);


const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<ReviewWithUser>) => {
      state.reviews.push(action.payload);
    },
    setReviews: (state, action: PayloadAction<ReviewWithUser[]>) => {
      state.reviews = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchReviewsBySchoolId
    builder
      .addCase(fetchReviewsBySchoolId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsBySchoolId.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsBySchoolId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Handle createReviewAsync
    builder
      .addCase(createReviewAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReviewAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReviewAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Handle updateReviewAsync
    builder
      .addCase(updateReviewAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReviewAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reviews.findIndex(review => review.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(updateReviewAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Handle deleteReviewAsync
    builder
      .addCase(deleteReviewAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReviewAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.reviews = state.reviews.filter(review => review.id !== action.payload);
      })
      .addCase(deleteReviewAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addReview, setReviews } = reviewSlice.actions;
export default reviewSlice.reducer;