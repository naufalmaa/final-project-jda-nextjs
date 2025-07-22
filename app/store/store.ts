// app/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import reviewReducer from './reviewSlice';
import schoolReducer from './schoolSlice';
// import middleware from '@middleware';

export const store = configureStore({
    reducer: {
      review: reviewReducer,
      school: schoolReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(store => next => action => {
        console.log('🌀 Dispatching', action);
        return next(action);
      })
  });
  

// Type untuk penggunaan di komponen
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
