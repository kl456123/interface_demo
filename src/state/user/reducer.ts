import { createReducer } from "@reduxjs/toolkit";
import { DEFAULT_DEADLINE_FROM_NOW } from "../../constants/misc";
import { updateVersion } from "../global/actions";
import { updateUserDarkMode } from "./actions";

const currentTimestamp = () => new Date().getTime();

export interface UserState {
  userDarkMode: boolean | null; // the user's choice for dark mode or light mode

  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number;

  // deadline set by user in minutes, used in all txns
  userDeadline: number;

  timestamp: number;
}

export const initialState: UserState = {
  userDarkMode: null,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  timestamp: currentTimestamp(),
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateVersion, (state) => {
      if (
        typeof state.userDeadline !== "number" ||
        !Number.isInteger(state.userDeadline) ||
        state.userDeadline < 60 ||
        state.userDeadline > 180 * 60
      ) {
        state.userDeadline = DEFAULT_DEADLINE_FROM_NOW;
      }
      state.lastUpdateVersionTimestamp = currentTimestamp();
    })
    .addCase(updateUserDarkMode, (state, action) => {
      state.userDarkMode = action.payload.userDarkMode;
      state.timestamp = currentTimestamp();
    })
);
