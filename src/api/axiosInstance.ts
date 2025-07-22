import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {},
  withCredentials: true,
});

// Automatically logs out User if token in HTTP Cookie is not found
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      localStorage.removeItem("twinstagram_logged_in_user");
    }
    return Promise.reject(error);
  }
);
