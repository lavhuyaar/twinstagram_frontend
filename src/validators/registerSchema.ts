import * as yup from "yup";

export const registerSchema = yup
  .object({
    firstName: yup
      .string()
      .required("Please enter your first name")
      .test(
        "length",
        "First name must contain between 2 and 30 characters",
        (value) =>
          typeof value === "string" &&
          value.trim().length > 1 &&
          value.trim().length <= 30
      )
      .matches(/^[A-Z]+$/i, "First name must contain alphabets only"),
    lastName: yup
      .string()
      .required("Please enter your last name")
      .test(
        "length",
        "Last name must contain between 2 and 30 characters",
        (value) =>
          typeof value === "string" &&
          value.trim().length > 1 &&
          value.trim().length <= 30
      )
      .matches(/^[A-Z]+$/i, "Last name must contain alphabets only"),
    username: yup.string().trim().required("Please enter a unique username"),
    password: yup
      .string()
      .required("Please enter a password")
      .min(6, "Password is too short - Minimum 6 characters"),
    confirm_password: yup
      .string()
      .required("Please retype your password")
      .oneOf([yup.ref("password")], "Your passwords do not match"),
  })
  .required();
