import { useState } from "react";
import { toast } from "react-toastify";
import { type SubmitHandler, useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";

import { yupResolver } from "@hookform/resolvers/yup";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";

import CustomInput from "../components/CustomInput";
import { registerSchema } from "../validators/registerSchema";

interface IRegisterFormValues {
  username: string;
  password: string;
  confirm_password: string;
  firstName: string;
  lastName: string;
}

const Register = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IRegisterFormValues>({ resolver: yupResolver(registerSchema) });

  const onSubmit: SubmitHandler<IRegisterFormValues> = async (values) => {
    toast.loading("Creating new profile...");
    setSubmitting(true);
    try {
      await axiosInstance.post("/auth/register", values);
      toast.dismiss();
      toast.success("Profile created successfully!", { autoClose: 4000 });
      reset();
      navigate("/auth/login");
    } catch (error) {
      handleAxiosError(error, "Failed to register!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <main className="p-6 sm:px-[5%] py-10 gap-2 items-center justify-center h-screen w-full flex flex-col max-w-[1800px]">
        <img src="/logo.png" alt="" className="w-[220px] sm:w-[300px]" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 bg-surface p-5 sm:p-8 w-full sm:w-[500px] drop-shadow-[4px, 0px, 4px] drop-shadow-primary"
        >
          <CustomInput
            register={register}
            name="firstName"
            placeholder="Example: John"
            labelText="First Name"
            type="text"
            errorMessage={errors.firstName?.message}
          />
          <CustomInput
            register={register}
            name="lastName"
            placeholder="Example: Doe"
            labelText="Last Name"
            type="text"
            errorMessage={errors.lastName?.message}
          />
          <CustomInput
            register={register}
            name="username"
            placeholder="Example: johndoe123"
            labelText="Username (must be unique)"
            type="text"
            errorMessage={errors.username?.message}
          />
          <CustomInput
            register={register}
            name="password"
            placeholder="Example: 123456"
            labelText="Password"
            type="password"
            errorMessage={errors.password?.message}
          />

          <CustomInput
            register={register}
            name="confirm_password"
            placeholder="Re-enter password"
            labelText="Re-enter the password"
            type="password"
            errorMessage={errors.confirm_password?.message}
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 text-md cursor-pointer font-semibold text-primary-txt bg-primary px-4 py-2 hover:bg-primary-hover transition"
          >
            Create new profile
          </button>
        </form>
        <p className="mt-2">
          Already have an account?{" "}
          <NavLink
            to="/auth/login"
            className="text-primary underline hover:text-primary-hover transition"
          >
            Login
          </NavLink>
        </p>
      </main>
    </>
  );
};
export default Register;
