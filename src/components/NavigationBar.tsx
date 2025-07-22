import { IoHomeSharp, IoSearch, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineAddBox, MdOutlinePending } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoIosSend } from "react-icons/io";
import useAuth from "../hooks/useAuth";
import { NavLink } from "react-router";

interface ILink {
  path: string;
  icon?: React.ReactNode;
  text: string;
}

const NavigationBar = ({ className }: { className?: string }) => {
  const { userData } = useAuth();

  const links: ILink[] = [
    {
      path: "/",
      text: "My Feed",
      icon: <IoHomeSharp className="text-xl" />,
    },

    {
      path: "/pending-requests",
      text: "Pending Requests",
      icon: <MdOutlinePending className="text-xl" />,
    },
    {
      path: "/sent-requests",
      text: "Sent Requests",
      icon: <IoIosSend className="text-xl" />,
    },
    {
      path: "/post/new",
      text: "Create New",
      icon: <MdOutlineAddBox className="text-xl" />,
    },
    {
      path: "/search-people",
      text: "Search People",
      icon: <IoSearch className="text-xl" />,
    },
    {
      path: `/u/${userData?.id}`,
      text: "My Profile",
      icon: <CgProfile className="text-xl" />,
    },
    {
      path: "/settings",
      text: "Settings",
      icon: <IoSettingsOutline className="text-xl" />,
    },
  ];
  return (
    <>
      <div className={`${className ?? ""}`}>
        {links.map((link, index) => (
          <NavLink
            to={link.path}
            key={index}
            title={link.text}
            className={({ isActive }) =>
              isActive
                ? "text-primary-txt"
                : "hover:text-primary-hover transition"
            }
          >
            {link.icon}
          </NavLink>
        ))}
      </div>
    </>
  );
};
export default NavigationBar;
