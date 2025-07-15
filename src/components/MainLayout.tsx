// import Footer from "./Footer";
// import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      {/* <Header /> */}
      <main className="h-screen w-full flex max-w-[1800px]">
        <Sidebar className="hidden md:flex overflow-x-auto w-[400px] z-99 overflow-y-auto flex-col bg-surface p-4 gap-2 text-text-primary" />
        <section className="h-full w-full overflow-y-auto text-text-primary flex flex-col p-6 sm:p-10">
          {children}
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
};
export default MainLayout;
