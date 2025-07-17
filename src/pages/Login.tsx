import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { NavLink } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import Footer from "../components/Footer";
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
      window.location.href = "/feed";
    }
  }, [userData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormValues>({ resolver: yupResolver(loginSchema) });

  const onSubmit: SubmitHandler<ILoginFormValues> = (values) =>
    loginUser(values);

  return (
    <>
      <Header />
      <main className="p-6 sm:px-[5%] py-10 gap-5 items-center justify-center">
        {userData ? (
          <div className="bg-surface p-5 sm:p-8 rounded-lg flex flex-col items-center gap-3">
            <h2 className="text-2xl text-center font-normal">
              {`Hey ${userData?.firstName}, you're already logged in!`}
            </h2>
            <button
              className="text-md cursor-pointer font-semibold text-primary-txt  bg-primary px-4 py-2 rounded-lg hover:bg-primary-hover transition"
              onClick={() => {
                logoutUser();
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-[26px] text-center font-semibold">
              Login @Yappin
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3 bg-surface p-5 sm:p-8 w-full sm:w-[500px] rounded-lg "
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
                className="mt-2 text-md cursor-pointer font-semibold text-primary-txt  bg-primary px-4 py-2 rounded-lg hover:bg-primary-hover transition"
              >
                Login
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

      <Footer />
    </>
  );
};

export default Login;
