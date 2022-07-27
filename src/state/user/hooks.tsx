import { useAppDispatch, useAppSelector } from "../hooks";
import { shallowEqual } from "react-redux";
import { updateUserDarkMode } from "./actions";
import { useCallback, useMemo } from "react";

export function useIsDarkMode(): boolean {
  const { userDarkMode } = useAppSelector(
    ({ user: { userDarkMode } }) => ({
      userDarkMode,
    }),
    shallowEqual
  );

  return userDarkMode === null ? false : userDarkMode;
}

export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch();
  const darkMode = useIsDarkMode();

  const toggleSetDarkMode = useCallback(() => {
    dispatch(updateUserDarkMode({ userDarkMode: !darkMode }));
  }, [darkMode, dispatch]);

  return [darkMode, toggleSetDarkMode];
}
