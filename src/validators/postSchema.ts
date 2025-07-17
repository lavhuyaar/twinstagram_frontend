import * as yup from "yup";

export const postSchema = yup.object({
  content: yup
    .string()
    .required("This field cannot be empty")
    .min(1, "This field cannot be empty")
    .max(2000, "Cannot exceed 2000 characters"),
  image: yup
    .mixed<File>()
    .nullable()
    .notRequired()
    .test(
      "fileType",
      "Image must be .png, .jpg, .jpeg, .avif, or .webp",
      (value) => {
        if (!value || (value instanceof FileList && value.length === 0))
          return true;

        const file = value instanceof FileList ? value[0] : value;

        return (
          file instanceof File &&
          [
            "image/webp",
            "image/png",
            "image/avif",
            "image/jpg",
            "image/jpeg",
          ].includes(file.type)
        );
      }
    )
    .test("fileSize", "Image cannot exceed 2MB", (value) => {
      if (!value || (value instanceof FileList && value.length === 0))
        return true;

      const file = value instanceof FileList ? value[0] : value;
      return file instanceof File && file.size <= 2 * 1024 * 1024;
    }),
});
