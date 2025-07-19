import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";
import type { IUser } from "../interfaces";

interface IAuthValues {
  userData: IUser | null;
  loading: boolean;
  loginUser: (credentials: { username: string; password: string }) => void;
  logoutUser: () => void;
  saveUser: (user: IUser) => void;
}

const AuthContext = createContext<IAuthValues | null>(null);

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [userData, setUserData] = useState<IUser | null>(
    JSON.parse(localStorage.getItem("twinstagram_logged_in_user") || "null")
  );
  const [loading, setLoading] = useState<boolean>(false);

  const loginUser = async (credentials: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    toast.loading("Logging in...");
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      const { user } = response.data;
      saveUser(user);
      toast.dismiss();
      toast.success("User logged in successfully!", {
        autoClose: 2000,
        onClose: () => (window.location.href = "/"),
      });
    } catch (error) {
      handleAxiosError(error, "Failed to login user!");
    } finally {
      setLoading(false);
    }
  };

  const saveUser = (data: IUser) => {
    setUserData(() => {
      localStorage.setItem("twinstagram_logged_in_user", JSON.stringify(data));
      return data;
    });
  };

  const logoutUser = async () => {
    toast.loading("Logging out...");
    setLoading(true);
    try {
      await axiosInstance.get("/auth/logout");
      // window.location.href = "/auth/login";
      toast.dismiss();
      toast.success("User logged out successfully!");
      localStorage.removeItem("twinstagram_logged_in_user");
      setUserData(null);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthContext.Provider
        value={{ userData, loading, loginUser, logoutUser, saveUser }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthContext;
