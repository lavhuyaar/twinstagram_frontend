import { Route, Routes } from "react-router";
import { Flip, ToastContainer } from "react-toastify";
import Home from "../pages/Home";
import PageNotFound from "../pages/PageNotFound";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Feed from "../pages/Feed";
import Settings from "../pages/Settings";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <ToastContainer
        autoClose={1000}
        hideProgressBar
        // theme={theme}
        transition={Flip}
        position="top-center"
      />
    </>
  );
};
export default AppRoutes;
