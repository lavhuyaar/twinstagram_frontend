import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {},
  withCredentials: true,
});

// Automatically logs out User if token in HTTP Cookie is not found
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response && [401, 403].includes(error.response.status)) {
      localStorage.removeItem("twinstagram_logged_in_user");
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
