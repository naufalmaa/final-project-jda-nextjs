// redux/store.ts
import { configureStore, Middleware } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import reviewReducer from './reviewSlice';
import schoolReducer from './schoolSlice';

// A simple custom middleware for logging actions
const loggingMiddleware: Middleware = store => next => action => {
  console.log('🌀 Dispatching', action);
  const result = next(action);
  console.log('✅ Next state', store.getState());
  return result;
};

export const store = configureStore({
  reducer: { 
    review: reviewReducer,
    school: schoolReducer 
  },
  // We can add custom middleware here.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggingMiddleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;