import { useRef, useState } from "react";
import { Link } from "react-router";
import { SlOptionsVertical } from "react-icons/sl";
import useOutsideClick from "../hooks/useOutsideClick";
import useAuth from "../hooks/useAuth";
import Modal from "./Modal";
import CommentInput from "./CommentInput";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";
import timeAgo from "../utils/timeAgo";
import type { ICommentReply } from "../interfaces";

const CommentReply = ({
  reply,
  getReplies,
}: {
  reply: ICommentReply;
  getReplies: VoidFunction;
}) => {
  const [subComment, setSubComment] = useState<ICommentReply>({ ...reply });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { isOpen, openMenu, closeMenu } = useOutsideClick(menuRef);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const { userData } = useAuth();

  const enableEditMode = () => {
    closeMenu();
    setIsEditMode(true);
  };

  const cancelEditMode = () => {
    setIsEditMode(false);
  };

  const editSubComment = (comment: ICommentReply) => {
    setSubComment(comment);
  };

  const deleteSubComment = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/comments/sub/${reply?.id}`);
      closeMenu();
      getReplies();
    } catch (err) {
      handleAxiosError(err, "Failed to delete comment!");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = () => {
    deleteSubComment();
  };

  return (
    <>
      <div className="flex items-center  gap-2 md:gap-4 w-full relative">
        <img
          src={subComment?.user?.profilePicture ?? "/blank-pfp.webp"}
          alt=""
          className="size-[30px] sm:size-[40px] rounded-full shrink-0 self-start"
        />

        <div className="flex flex-col w-full">
          <div className="flex items-center w-full gap-3">
            <Link
              to={`/u/${subComment?.userId}`}
              className="text-sm font-semibold hover:text-primary transition"
            >
              @{subComment?.user?.username}
            </Link>
            <p className="text-text-muted text-xs">
              {timeAgo(subComment?.createdAt)}
            </p>
            {subComment?.createdAt !== subComment?.updatedAt && (
              <p className="text-text-muted text-xs">(edited)</p>
            )}
          </div>

          {isEditMode ? (
            <CommentInput
              postId={subComment?.postId}
              commentId={subComment?.id}
              refreshComments={getReplies}
              className="mt-4"
              reset={cancelEditMode}
              defaultValue={subComment?.content}
              isEditMode={isEditMode}
              editSubComment={editSubComment}
            />
          ) : (
            <pre className="text-wrap text-sm md:text-[16px] mt-[3px] break-all">
              {subComment?.content}
            </pre>
          )}
        </div>
        {/* Comment options only visible to the creator of comment and the creator of post*/}
        {userData?.id === subComment?.userId && (
          <button
            onClick={openMenu}
            className="ml-auto md:pr-4 bg-none cursor-pointer"
          >
            <SlOptionsVertical />
          </button>
        )}
        {isOpen && (
          <div
            className="bg-surface absolute items-start rounded-md right-10 flex flex-col gap-2 px-6 py-2 top-0 text-start"
            ref={menuRef}
          >
            <button
              onClick={enableEditMode}
              className="text-text-primary hover:text-primary-hover transition cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={openDeleteModal}
              className="text-text-primary hover:text-primary-hover transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {isDeleteModalOpen && (
        <Modal>
          <p>Are you sure you want to delete this comment?</p>
          <div className="flex gap-4 mt-4 justify-center items-center">
            <button
              onClick={closeDeleteModal}
              disabled={loading}
              className={`${
                loading ? "" : "hover:bg-primary-hover"
              } cursor-pointer px-4 py-2 bg-primary/40  transition text-primary-txt font-semibold`}
            >
              Close
            </button>
            <button
              onClick={onDelete}
              disabled={loading}
              className={`${
                loading ? "bg-primary/40" : "bg-primary hover:bg-primary-hover"
              } cursor-pointer px-4 py-2   transition text-primary-txt font-semibold`}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};
export default CommentReply;
