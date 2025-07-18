import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";

const RedirectToLogin = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/auth/login", { replace: true });
    }
  }, [userData]);

  return <></>;
};
export default RedirectToLogin;
