import { configureStore } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";

import user from "./user/reducer";

const PERSISTED_KEYS: string[] = ["user"];

const store = configureStore({
  reducer: {
    user,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true }).concat(
      save({ states: PERSISTED_KEYS, debounce: 1000 })
    ),
  preloadedState: load({
    states: PERSISTED_KEYS,
    disableWarnings: process.env.NODE_ENV === "test",
  }),
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
