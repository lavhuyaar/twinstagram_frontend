import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

const RedirectToLogin = () => {
  const { userData } = useAuth();

  useEffect(() => {
    if (!userData) {
      window.location.href = "/auth/login";
    }
  }, [userData]);

  return <></>;
};
export default RedirectToLogin;
