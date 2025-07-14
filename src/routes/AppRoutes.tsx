import { Route, Routes } from "react-router";
import Home from "../pages/Home";
import PageNotFound from "../pages/PageNotFound";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};
export default AppRoutes;
