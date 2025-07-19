import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { NavLink } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import useAuth from "../hooks/useAuth";
import CustomInput from "../components/CustomInput";
import { loginSchema } from "../validators/loginSchema";

interface ILoginFormValues {
  username: string;
  password: string;
}

const Login = () => {
  const { userData, loading, loginUser, logoutUser } = useAuth();

  useEffect(() => {
    if (userData) {
      window.location.href = "/";
    }
  }, [userData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormValues>({ resolver: yupResolver(loginSchema) });

  const onSubmit: SubmitHandler<ILoginFormValues> = (values) =>
    loginUser(values);

  const guestLogin = () =>
    loginUser({ username: "guestuser", password: "123456" });

  return (
    <>
      <main className="p-6 sm:px-[5%] py-10 gap-2 items-center justify-center h-screen w-full flex flex-col max-w-[1800px]">
        {userData ? (
          <div className="bg-surface p-5 sm:p-8 flex flex-col items-center gap-3">
            <h2 className="text-2xl text-center font-normal">
              {`Hey ${userData?.firstName}, you're already logged in!`}
            </h2>
            <button
              className="text-md cursor-pointer font-semibold text-primary-txt bg-primary px-4 py-2 hover:bg-primary-hover transition"
              onClick={() => {
                logoutUser();
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <img src="/logo.png" alt="" className="w-[220px] sm:w-[300px]" />

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3 bg-surface p-5 sm:p-8 w-full sm:w-[500px]"
            >
              <CustomInput
                register={register}
                name="username"
                placeholder="Example: johndoe123"
                labelText="Your Username:"
                type="text"
                errorMessage={errors.username?.message}
              />
              <CustomInput
                register={register}
                name="password"
                placeholder="Example: 123456"
                labelText="Your Password:"
                type="password"
                errorMessage={errors.password?.message}
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-2 text-md cursor-pointer font-semibold text-primary-txt bg-primary px-4 py-2 hover:bg-primary-hover transition"
              >
                Login
              </button>

              <div className="flex items-center gap-3 my-4 self-center w-full opacity-60">
                <span className="w-full h-[1px] bg-text-muted"></span>
                <span className="text-text-muted">OR</span>
                <span className="w-full h-[1px] bg-text-muted"></span>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={guestLogin}
                className="mt-2 text-md cursor-pointer px-4 py-2 border-1 border-text-primary hover:bg-primary-hover/30 text-text-primary transition"
              >
                Login as Guest
              </button>
            </form>

            <p>
              {"Don't have an account? "}
              <NavLink
                to="/auth/register"
                className="text-primary underline hover:text-primary-hover transition"
              >
                Register
              </NavLink>
            </p>
          </>
        )}
      </main>
    </>
  );
};

export default Login;
