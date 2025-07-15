import { useRef, useState } from "react";
import { Link } from "react-router";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import type { InferType } from "yup";
import { RxCross2 } from "react-icons/rx";
import { FaArrowLeft } from "react-icons/fa6";
import useAuth from "../hooks/useAuth";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSchema } from "../validators/profileSchema";
import CustomInput from "../components/CustomInput";
import { PROFILE_TYPE } from "../constants/constants";
import CustomToggler from "../components/CustomToggler";
import { toast } from "react-toastify";

type IProfileValues = InferType<typeof profileSchema>;

const EditProfileSection = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { userData, saveUser } = useAuth();
  const [profilePicture, setProfilePicture] = useState<File | string | null>(
    userData?.profilePicture ?? null
  );
  const [isPrivateAccount, setIsPrivateAccount] = useState<boolean>(
    userData?.profileType === PROFILE_TYPE.PRIVATE
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IProfileValues>({
    resolver: yupResolver(profileSchema) as Resolver<IProfileValues>,
  });

  const toggleButton = () => setIsPrivateAccount((prev) => !prev);

  const resetChanges = () => {
    reset({
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      username: userData?.username,
    });
    setProfilePicture(userData?.profilePicture ?? null);
    setIsPrivateAccount(userData?.profileType === PROFILE_TYPE.PRIVATE);
  };

  const fileInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files[0]) {
      setProfilePicture(files[0]);
      setValue("profilePicture", files[0], { shouldValidate: true });
    }
  };

  const onSubmit: SubmitHandler<IProfileValues> = async (values) => {
    setSubmitting(true);
    try {
      const formValues = new FormData();

      formValues.append("firstName", values.firstName);
      formValues.append("lastName", values.lastName);
      formValues.append("username", values.username);
      formValues.append(
        "profileType",
        isPrivateAccount ? PROFILE_TYPE.PRIVATE : PROFILE_TYPE.PUBLIC
      );

      if (profilePicture) {
        formValues.append("profilePicture", profilePicture);
      }

      const response = await axiosInstance.put("/profile", formValues);
      toast.dismiss();
      toast.success("Profile updated successfully!", { autoClose: 4000 });
      saveUser(response.data?.user);
      if (fileInputRef.current?.files) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      handleAxiosError(error, "Failed to update profile!");
    } finally {
      setSubmitting(false);
    }
  };

  const removeProfilePicture = () => {
    if (fileInputRef.current?.files) {
      fileInputRef.current.value = "";
      setValue("profilePicture", null, { shouldValidate: true });
      setProfilePicture(null);
    }
  };

  return (
    <section className="flex flex-col w-full mt-6 items-center">
      <Link
        to="/settings"
        className="flex items-center gap-3 hover:text-primary-hover transition self-start"
      >
        <FaArrowLeft /> Go back to Settings
      </Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 p-6 w-full sm:w-[400px] bg-surface mt-6 md:mt-16 drop-shadow-[4px, 0px, 4px] drop-shadow-primary"
      >
        <div className="self-center relative">
          <img
            title="Change Profile Picture"
            onClick={() => fileInputRef.current?.click()}
            src={
              profilePicture instanceof File
                ? URL.createObjectURL(profilePicture)
                : typeof profilePicture === "string"
                ? profilePicture
                : "/blank-pfp.webp"
            }
            alt=""
            className="rounded-full size-[100px] cursor-pointer my-4 shrink-0 object-center object-cover"
          />
          <button
            type="button"
            onClick={removeProfilePicture}
            title="Remove Profile Picture"
            className="bg-red-700 rounded-full cursor-pointer absolute bottom-6 -right-0 p-0.5 text-xl text-white"
          >
            <RxCross2 />
          </button>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={(e) => {
            register("profilePicture").ref(e);
            fileInputRef.current = e;
          }}
          className="hidden"
          defaultValue={undefined}
          accept=".png, .jpeg, .jpg, .avif, .webp"
          onChange={fileInputOnChange}
        />

        {errors.profilePicture?.message && (
          <p className="text-red-500 text-sm w-full text-center">
            {errors.profilePicture?.message}
          </p>
        )}

        <CustomInput
          register={register}
          name="firstName"
          placeholder="Example: John"
          labelText="First Name"
          type="text"
          value={userData?.firstName}
          errorMessage={errors.firstName?.message}
        />
        <CustomInput
          register={register}
          name="lastName"
          placeholder="Example: Doe"
          labelText="Last Name"
          type="text"
          value={userData?.lastName}
          errorMessage={errors.lastName?.message}
        />
        <CustomInput
          register={register}
          name="username"
          placeholder="Example: johndoe123"
          labelText="Username (must be unique)"
          type="text"
          value={userData?.username}
          errorMessage={errors.username?.message}
        />

        <div className="flex items-center justify-between mt-4 gap-2 text-xs font-semibold">
          <p>Do you want your account to be private?</p>
          <CustomToggler onClick={toggleButton} isChecked={isPrivateAccount} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`${
            submitting ? "opacity-20" : "hover:bg-primary-hover transition"
          } mt-2 text-md font-semibold cursor-pointer text-primary-txt  bg-primary px-4 py-2`}
        >
          {submitting ? "Updating profile..." : "Update Profile"}
        </button>

        <button
          type="button"
          disabled={submitting}
          onClick={resetChanges}
          className={`${
            submitting ? "opacity-20" : "hover:bg-primary-hover transition"
          } text-md font-semibold cursor-pointer text-primary-txt  bg-primary/60 px-4 py-2`}
        >
          Reset changes
        </button>
      </form>
    </section>
  );
};
export default EditProfileSection;
