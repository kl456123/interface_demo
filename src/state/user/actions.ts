import { createAction } from "@reduxjs/toolkit";

export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>(
  "user/updateUserDarkMode"
);
export const updateUserDeadline = createAction<{ userDeadline: number }>(
  "user/updateUserDeadline"
);
