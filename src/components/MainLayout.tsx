import NavigationBar from "./NavigationBar";
import RedirectToLogin from "./RedirectToLogin";
import Sidebar from "./Sidebar";

const MainLayout = ({
  children,
  mainStyling,
}: {
  children?: React.ReactNode;
  mainStyling?: string;
}) => {
  return (
    <>
      <RedirectToLogin />
      <div className="h-screen w-full flex max-w-[1800px] relative">
        <Sidebar className="hidden md:flex overflow-x-auto w-[400px] z-99 overflow-y-auto flex-col bg-surface p-4 gap-2 text-text-primary" />
        <NavigationBar className="md:hidden flex items-center justify-evenly fixed bottom-0 z-[99999] bg-primary w-full h-[60px]" />
        <main
          className={`h-full w-full overflow-y-auto text-text-primary flex flex-col py-10 px-3 sm:p-10 items-center justify-baseline ${
            mainStyling ?? ""
          }`}
        >
          {children}
        </main>
      </div>
    </>
  );
};
export default MainLayout;
