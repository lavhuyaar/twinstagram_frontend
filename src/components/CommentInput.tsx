import { useState, type Dispatch, type SetStateAction } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";
import useAuth from "../hooks/useAuth";
import type { IComment, ICommentReply } from "../interfaces";

interface ICommentInputProps {
  postId?: string;
  repliedToCommentId?: string | null;
  className?: string;
  refreshComments: VoidFunction;
  reset?: VoidFunction;
  setRepliesCount?: Dispatch<SetStateAction<number>>;
  defaultValue?: string;
  isEditMode?: boolean;
  commentId?: string;
  editComment?: (comment: IComment) => void;
  editSubComment?: (subComment: ICommentReply) => void;
}

const CommentInput = ({
  postId,
  repliedToCommentId,
  className,
  refreshComments,
  reset,
  setRepliesCount,
  defaultValue,
  isEditMode,
  commentId,
  editComment,
  editSubComment,
}: ICommentInputProps) => {
  const [value, setValue] = useState<string>(defaultValue || "");
  const [validation, setValidation] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { userData } = useAuth();

  const inputOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);

    if (inputValue.trim()) {
      setValidation("");
    } else {
      setValidation("Comment must be between 1 and 200 characters.");
    }
  };

  const cancelOnClick = () => {
    if (reset) {
      reset();
    }
    setValue("");
    setValidation("");
  };

  const commentOnSubmit = async () => {
    if (!value.trim()) {
      setValidation("Comment must be between 1 and 200 characters.");
    }
    if (validation || !value.trim()) return;
    setSubmitting(true);
    try {
      if (isEditMode) {
        if (editComment) {
          const response = await axiosInstance.put(`/comments/${commentId}`, {
            content: value,
          });

          editComment(response.data?.comment);
        }
        if (editSubComment) {
          const response = await axiosInstance.put(
            `/comments/sub/${commentId}`,
            {
              content: value,
            }
          );

          editSubComment(response.data?.comment);
        }
      } else {
        await axiosInstance.post(`/comments`, {
          content: value,
          postId,
          repliedToCommentId,
        });
      }
      setValidation("");
      setValue("");
      refreshComments();
      if (reset) {
        reset();
      }
      if (setRepliesCount && !isEditMode) {
        setRepliesCount((prev) => prev + 1);
      }
    } catch (err) {
      handleAxiosError(err, "Failed to create comment!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={`w-full flex flex-col gap-4 ${className ?? ""}`}>
        <div className="w-full flex items-center">
          {!isEditMode && (
            <img
              src={userData?.profilePicture ?? "/blank-pfp.webp"}
              alt=""
              className="size-[30px] sm:size-[40px] rounded-full shrink-0"
            />
          )}
          <div
            className={`flex flex-col gap-1 w-full ${
              isEditMode ? "sm:pr-6 pr-3" : "sm:px-6 px-3"
            }`}
          >
            <textarea
              className="text-text-primary outline-none text-xs w-full border-none resize-none"
              placeholder={isEditMode ? "Edit comment..." : "Add a comment..."}
              value={value}
              onChange={inputOnChange}
            ></textarea>
            <span className="w-full bg-primary h-[2px]"></span>
            {validation && (
              <p className="text-xs mt-1 text-red-600">{validation}</p>
            )}
          </div>
        </div>
        <div className="self-end px-3 sm:px-6 flex items-center gap-3">
          <button
            disabled={submitting}
            onClick={cancelOnClick}
            className={`${
              submitting ? "bg-primary/40" : ""
            } bg-primary/40 hover:bg-primary-hover rounded-2xl text-sm sm:text-[16px] transition px-2 py-1 text-primary-txt font-semibold cursor-pointer`}
          >
            Cancel
          </button>
          <button
            disabled={submitting}
            className={`${submitting ? "bg-primary/40" : ""} ${
              !value.trim()
                ? "bg-primary/40"
                : "bg-primary hover:bg-primary-hover"
            } rounded-2xl transition px-4 py-1 text-primary-txt text-sm sm:text-[16px] font-semibold cursor-pointer`}
            onClick={commentOnSubmit}
          >
            {isEditMode ? "Edit" : repliedToCommentId ? "Reply" : "Comment"}
          </button>
        </div>
      </div>
    </>
  );
};
export default CommentInput;
