import { Route, Routes } from "react-router";
import { Flip, ToastContainer } from "react-toastify";
import useTheme from "../hooks/useTheme";
import Home from "../pages/Home";
import PageNotFound from "../pages/PageNotFound";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Feed from "../pages/Feed";
import Settings from "../pages/Settings";
import PostDetail from "../pages/PostDetail";

const AppRoutes = () => {
  const { theme } = useTheme();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/p/:postId" element={<PostDetail />} />
      </Routes>
      <ToastContainer
        autoClose={1000}
        hideProgressBar
        theme={theme}
        transition={Flip}
        position="top-center"
      />
    </>
  );
};
export default AppRoutes;
