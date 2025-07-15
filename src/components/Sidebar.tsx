import { Link, NavLink } from "react-router";
import { MdLogout, MdOutlinePending } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import {
  IoHomeSharp,
  IoPeopleOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import useAuth from "../hooks/useAuth";
import ThemeToggler from "./ThemeToggler";

interface ILink {
  path: string;
  icon?: React.ReactNode;
  text: string;
}

const Sidebar = ({ className }: { className?: string }) => {
  const { userData } = useAuth();

  const links: ILink[] = [
    {
      path: "/feed",
      text: "My Feed",
      icon: <IoHomeSharp className="text-xl" />,
    },

    {
      path: "/fddadada",
      text: "Pending Requests",
      icon: <MdOutlinePending className="text-xl" />,
    },
    {
      path: "/feedadadadad",
      text: "Find More People",
      icon: <IoPeopleOutline className="text-xl" />,
    },
    {
      path: "/my-profile",
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
      <aside className={`${className || ""}`}>
        <Link to="/feed" className="pl-3">
          <img
            src="/logo.png"
            alt="Twinstagram"
            className="shrink-0 w-[160px]"
          />
        </Link>

        <section className="flex flex-col items-center w-full mt-6 text-center">
          <img
            src={userData?.profilePicture ?? "/blank-pfp.webp"}
            alt="Profile"
            className="h-[100px] shrink-0 w-[100px] rounded-full object-center object-cover"
          />

          <h2 className="font-semibold text-xl mt-4 w-full">{`${userData?.firstName} ${userData?.lastName}`}</h2>
          <h3 className="text-sm font-normal text-text-muted w-full">
            @{userData?.username}
          </h3>

          {/* <div className="flex items-center text-sm gap-2">
            <div className="flex flex-col items-center text-center p-3">
              <p className="p-1 w-full text-xl font-semibold">
                {userData?._count?.posts}
              </p>
              <p className="w-full font-normal">Posts</p>
            </div>
            <span className="w-[2px] bg-black h-[20px] mb-4"></span>
            <div className="flex flex-col items-center text-center p-3">
              <p className="p-1  w-full text-xl font-semibold">
                {userData?._count?.followers}
              </p>
              <p className="w-full font-normal">Followers</p>
            </div>
            <span className="w-[2px] bg-black h-[20px] mb-4"></span>
            <div className="flex flex-col items-center text-center p-3">
              <p className="p-1 w-full text-xl font-semibold">
                {userData?._count?.following}
              </p>
              <p className="w-full font-normal">Following</p>
            </div>
          </div> */}
        </section>

        <section className="flex flex-col gap-1 mt-12">
          {links.map((link, index) => (
            <NavLink
              to={link.path}
              key={index}
              className={({ isActive }) =>
                isActive
                  ? "text-primary-hover rounded-full py-2 px-4 flex gap-4 items-center w-full font-semibold"
                  : "hover:text-primary-hover transition rounded-full py-2 px-4 p-2 flex gap-4 items-center w-full font-medium"
              }
            >
              {link.icon}
              <span className="text-[16px]">{link.text}</span>
            </NavLink>
          ))}
        </section>

        <div className="flex items-center gap-4 mt-16 pl-3">
          <ThemeToggler />
          <span className="text-[16px]">Dark Mode</span>
        </div>
        <button className="cursor-pointer font-medium text-[16px] mt-24 text-start w-full flex gap-4 items-center hover:text-primary-hover transition rounded-full py-2 px-4">
          <MdLogout className="text-xl" />
          <span>Logout</span>{" "}
        </button>
      </aside>
    </>
  );
};
export default Sidebar;
