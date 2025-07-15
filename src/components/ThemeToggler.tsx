import { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme";
import CustomToggler from "./CustomToggler";

const ThemeToggler = () => {
  const { theme, toggleTheme } = useTheme();
  const [isChecked, setIsChecked] = useState<boolean>(theme === "dark");

  useEffect(() => {
    setIsChecked(theme === "dark");
  }, [theme]);

  return (
    <>
      <CustomToggler
        isChecked={isChecked}
        onClick={toggleTheme}
        title={
          isChecked
            ? "Dark Mode is enabled. Click here to disable it!"
            : "Dark Mode is disabled. Click here to enable it!"
        }
      />
    </>
  );
};

export default ThemeToggler;
