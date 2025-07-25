import { useSearchParams } from "react-router";
import { MdKeyboardArrowRight } from "react-icons/md";
import useAuth from "../hooks/useAuth";
import MainLayout from "../components/MainLayout";
import ThemeToggler from "../components/ThemeToggler";
import ProfileTypeToggler from "../components/ProfileTypeToggler";
import EditProfileSection from "../sections/EditProfileSection";

const List = ({
  children,
  onClick,
  className,
  title,
}: {
  className?: string;
  children?: React.ReactNode;
  onClick?: VoidFunction;
  title?: string;
}) => {
  return (
    <li
      title={title}
      className={`${
        className || ""
      } list-none border-b border-text-muted/15 w-full py-4 flex justify-between items-center cursor-pointer hover:text-primary-hover transition`}
      onClick={onClick}
    >
      {children}
    </li>
  );
};

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { logoutUser } = useAuth();

  const optionOnClick = (value: string) => {
    const params = new URLSearchParams();
    params.set("selected", value);
    setSearchParams(params);
  };

  const selectedOption = searchParams.get("selected");

  return (
    <>
      <MainLayout>
        <section className="w-full flex flex-col">
          <h1 className="text-3xl font-bold text-primary">
            {selectedOption === "edit_profile"
              ? " Edit Profile"
              : selectedOption === "about"
              ? "About"
              : "Settings"}
          </h1>
          <span className="w-full h-[2px] bg-primary mt-1"></span>
        </section>
        {!selectedOption && (
          <section className="flex flex-col w-full mt-6">
            <List
              className="py-5"
              title="Edit Profile"
              onClick={() => optionOnClick("edit_profile")}
            >
              Edit Profile
              <MdKeyboardArrowRight className="text-2xl" />
            </List>

            <List title="Enable Dark Mode">
              Enable Dark Mode
              <ThemeToggler />
            </List>

            <List title="Private Account">
              Private Account
              <ProfileTypeToggler />
            </List>
            <em className="text-sm text-text-muted mt-1">
              When your account is private, only people following you can see
              your posts, following and followers.
            </em>

            <List className="py-5 mt-12" title="Logout" onClick={logoutUser}>
              Logout
              <MdKeyboardArrowRight className="text-2xl" />
            </List>
          </section>
        )}
        {selectedOption === "edit_profile" && <EditProfileSection />}
      </MainLayout>
    </>
  );
};
export default Settings;
