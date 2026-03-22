import { configureStore } from "@reduxjs/toolkit";
import trackerReducer from "../features/tracker/trackerSlice";
import { loadState, saveState } from "../utils/localStorage";

const preloadedState = loadState();

export const store = configureStore({
  reducer: { tracker: trackerReducer },
  preloadedState: preloadedState ? { tracker: preloadedState } : undefined,
});

//Subscribe to store changes
store.subscribe(() => {
  saveState(store.getState().tracker);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
