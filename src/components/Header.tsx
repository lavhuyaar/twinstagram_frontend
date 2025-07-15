import { useState } from "react";
import { NavLink } from "react-router";
import { toast } from "react-toastify";
// import { MdKeyboardArrowDown } from "react-icons/md";

import useAuth from "../hooks/useAuth";
// import useTheme from "../hooks/useTheme";
// import ThemeToggler from "./ThemeToggler";

const Header = () => {
  const { userData, logoutUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const logoutHandler = () => {
    logoutUser();
    toast.success("User logged out successfully!");
  };

  return (
    <header className="bg-primary text-primary-txt flex justify-center items-center w-full px-6 md:px-10 py-4 z-999 sticky top-0">
      <nav className="flex justify-between w-full max-w-[1800px]">
        <NavLink to="/" className="text-3xl font-black flex items-center">
          {/* <img
            src={`/yappin-logo-${theme}.png`}
            alt="Yappin"
            className="object-center w-[120px] md:w-[150px]"
          /> */}
        </NavLink>

        <div className="flex items-center gap-1 md:gap-4">
          {/* <ThemeToggler /> */}
          {userData ? (
            <div className="relative">
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={toggleMenu}
                title="More options"
              >
                <img
                  src={userData?.profilePicture ?? "/blank-pfp.webp"}
                  alt="Menu"
                  className="size-[30px] md:size-[40px] rounded-full shrink-0 object-center object-cover"
                />
                {/* <MdKeyboardArrowDown className="text-2xl" /> */}
              </div>

              <div
                className={`absolute w-[200px] rounded-lg flex-col right-1 top-12 bg-surface shadow ${
                  isMenuOpen ? "flex" : "hidden"
                }`}
              >
                <NavLink
                  to="/profile"
                  title="Edit Profile"
                  className="cursor-pointer text-text-primary px-2 md:px-4 font-semibold py-2 hover:bg-primary-hover/20 transition"
                >
                  Edit Profile
                </NavLink>
                <NavLink
                  to="/chats"
                  title="My Chats"
                  className="cursor-pointer text-text-primary px-2 md:px-4 font-semibold py-2 hover:bg-primary-hover/20 transition"
                >
                  My Chats
                </NavLink>
                <NavLink
                  to="/users"
                  title="Find more people to talk"
                  className="cursor-pointer text-text-primary px-2 md:px-4 font-semibold py-2 hover:bg-primary-hover/20 transition"
                >
                  Find more people
                </NavLink>
                <button
                  onClick={logoutHandler}
                  title="Log Out"
                  className="cursor-pointer text-text-primary px-2 md:px-4 w-full font-semibold text-start py-2 rounded-b-lg hover:bg-red-700/30 transition"
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="cursor-pointer text-primary-txt text-lg px-2 md:px-4 font-semibold py-2 rounded-lg hover:bg-primary-hover transition"
            >
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
