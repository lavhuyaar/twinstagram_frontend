import { useImperativeHandle, useRef, useState } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import type { InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import MainLayout from "../components/MainLayout";
import { handleAxiosError } from "../utils/handleAxiosError";
import { axiosInstance } from "../api/axiosInstance";
import { postSchema } from "../validators/postSchema";
import { MdOutlineAddBox } from "react-icons/md";
import { useNavigate } from "react-router";

type IPostValues = InferType<typeof postSchema>;

const AddPost = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IPostValues>({
    resolver: yupResolver(postSchema) as Resolver<IPostValues>,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const navigate = useNavigate();

  const onCancel = () => navigate(-1);

  const textAreaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const { ref, ...rest } = register("content");

  useImperativeHandle(ref, () => textAreaRef.current);

  const fileInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files[0]) {
      setImage(files[0]);
      setValue("image", files[0], { shouldValidate: true });
    }
  };

  const onSubmit: SubmitHandler<IPostValues> = async (values, event) => {
    event?.preventDefault();
    setSubmitting(true);
    try {
      const formValues = new FormData();
      formValues.append("content", values.content);

      if (image) {
        formValues.append("image", image);
      }
      const response = await axiosInstance.post("/posts/new", formValues);
      const { post } = response.data;
      toast.dismiss();
      toast.success("Post created successfully!", { autoClose: 4000 });
      navigate(`/p/${post?.id}`, { replace: true });
    } catch (error) {
      handleAxiosError(error, "Failed to update profile!");
    } finally {
      setSubmitting(false);
    }
  };

  const removeImage = () => {
    if (fileInputRef.current?.files) {
      fileInputRef.current.value = "";
      setValue("image", null, { shouldValidate: true });
      setImage(null);
    }
  };

  return (
    <>
      <MainLayout>
        <div className="w-full flex flex-col">
          <h1 className="text-3xl w-full font-bold text-primary self-start">
            New Post
          </h1>
          <span className="w-full h-[2px] bg-primary mt-1"></span>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 p-6 w-full md:w-4/5 bg-surface mt-6 md:mt-16 drop-shadow-[4px, 0px, 4px] drop-shadow-primary"
        >
          <div className="flex flex-col w-full gap-2">
            <textarea
              placeholder="Share your thoughts..."
              className="resize-none w-full focus:outline-none align-middle"
              id="content"
              rows={1}
              ref={textAreaRef}
              {...rest}
              onChange={(e) => {
                textAreaOnChange(e);
                rest.onChange(e);
              }}
            />
            {errors?.content?.message && (
              <p className="text-red-500 text-sm w-full text-start">
                {errors.content?.message}
              </p>
            )}
          </div>

          {image ? (
            <div className="flex flex-col w-full items-center gap-4 relative">
              <img
                className="w-full object-contain object-center bg-no-repeat"
                src={URL.createObjectURL(image)}
              />
              {errors.image?.message && (
                <p className="text-red-500 text-sm w-full text-start">
                  {errors.image?.message}
                </p>
              )}
              <div className="flex items-center absolute right-2 top-2">
                <button
                  onClick={removeImage}
                  type="button"
                  disabled={submitting}
                  className={`${
                    submitting ? "" : "hover:text-primary-hover"
                  } text-primary rounded-2xl text-sm sm:text-[16px] transition px-2 py-1 font-semibold cursor-pointer`}
                >
                  Remove
                </button>
                <button
                  disabled={submitting}
                  type="button"
                  className={`${
                    submitting ? "" : "hover:text-primary-hover"
                  } text-primary rounded-2xl text-sm sm:text-[16px] transition px-2 py-1 font-semibold cursor-pointer`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Image
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="w-full flex h-[400px] border border-primary/40 flex-col cursor-pointer p-3 items-center text-center justify-center"
            >
              <MdOutlineAddBox className="text-3xl sm:text-5xl" />
              <span className="font-medium">Click here to attach image</span>
              <span className="text-xs">
                (png, jpg, jpeg, webp and avif allowed upto 2MB)
              </span>
            </button>
          )}

          {/* Hidden file input */}
          <input
            type="file"
            ref={(e) => {
              register("image").ref(e);
              fileInputRef.current = e;
            }}
            className="hidden"
            defaultValue={undefined}
            accept=".png, .jpeg, .jpg, .avif, .webp"
            onChange={fileInputOnChange}
          />

          <div className="flex items-center gap-2 self-end">
            <button
              type="button"
              disabled={submitting}
              onClick={onCancel}
              className={`${
                submitting ? "bg-primary/40" : ""
              } bg-primary/40 hover:bg-primary-hover rounded-2xl text-sm sm:text-[16px] transition px-2 py-1 text-primary-txt font-semibold cursor-pointer`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`${
                submitting ? "bg-primary/40" : ""
              } bg-primary hover:bg-primary-hover rounded-2xl transition px-4 py-1 text-primary-txt text-sm sm:text-[16px] font-semibold cursor-pointer`}
            >
              {submitting ? "Creating new post..." : "Create new post"}
            </button>
          </div>
        </form>
      </MainLayout>
    </>
  );
};
export default AddPost;
