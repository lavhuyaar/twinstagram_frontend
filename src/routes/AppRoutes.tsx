import { Route, Routes } from "react-router";
import { Flip, ToastContainer } from "react-toastify";
import useTheme from "../hooks/useTheme";
import PageNotFound from "../pages/PageNotFound";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Feed from "../pages/Feed";
import Settings from "../pages/Settings";
import PostDetail from "../pages/PostDetail";
import AddPost from "../pages/AddPost";
import UserProfile from "../pages/UserProfile";
import PendingRequests from "../pages/PendingRequests";

const AppRoutes = () => {
  const { theme } = useTheme();
  return (
    <>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/p/:postId" element={<PostDetail />} />
        <Route path="/post/new" element={<AddPost />} />
        <Route path="/u/:userId" element={<UserProfile />} />
        <Route path="/pending-requests" element={<PendingRequests />} />
      </Routes>
      <ToastContainer
        autoClose={1000}
        hideProgressBar
        theme={theme}
        style={{ zIndex: 999999 }}
        transition={Flip}
        position="top-center"
      />
    </>
  );
};
export default AppRoutes;
