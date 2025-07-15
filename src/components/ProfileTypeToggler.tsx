import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { handleAxiosError } from "../utils/handleAxiosError";
import CustomToggler from "./CustomToggler";
import { axiosInstance } from "../api/axiosInstance";
import { PROFILE_TYPE } from "../constants/constants";

const ProfileTypeToggler = () => {
  const { userData, saveData } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState(
    userData?.profileType === PROFILE_TYPE.PRIVATE
  );

  if (!userData) return null;

  const changeProfileType = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `/profile/type/toggle?profileType=${
          isChecked ? PROFILE_TYPE.PUBLIC : PROFILE_TYPE.PRIVATE
        }`
      );
      const { user } = response.data;
      setIsChecked(user?.profileType === PROFILE_TYPE.PRIVATE);
      saveData(user);
    } catch (err) {
      handleAxiosError(err, "Failed to change profile type!", undefined, false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomToggler
      onClick={changeProfileType}
      isDisabled={loading}
      isChecked={isChecked}
      title={
        isChecked
          ? "Private Mode is enabled. Click to disable it."
          : "Private Mode is disabled. Click to enable it."
      }
    />
  );
};
export default ProfileTypeToggler;
