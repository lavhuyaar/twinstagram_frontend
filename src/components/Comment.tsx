import { useRef, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { Link } from "react-router";
import useOutsideClick from "../hooks/useOutsideClick";
import useAuth from "../hooks/useAuth";
import useCommentReply from "../hooks/useCommentReply";
import Modal from "./Modal";
import CommentSkeleton from "./skeletons/CommentSkeleton";
import CommentReply from "./CommentReply";
import CommentInput from "./CommentInput";
import { type IComment } from "../interfaces";
import timeAgo from "../utils/timeAgo";
import { abbreviateNumber } from "../utils/abbreviateNumber";

interface ICommentProps extends IComment {
  deleteComment: (id: string) => void;
  isDeleting: boolean;
}

const Comment = ({
  content,
  id,
  user,
  userId,
  createdAt,
  updatedAt,
  postId,
  _count,
  deleteComment,
  isDeleting,
}: ICommentProps) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [comment, setComment] = useState<IComment>({
    content,
    id,
    user,
    userId,
    createdAt,
    updatedAt,
    postId,
    _count,
  });
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { isOpen, openMenu, closeMenu } = useOutsideClick(menuRef);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const { userData } = useAuth();
  const {
    replies,
    loading,
    error,
    getReplies,
    repliesCount,
    repliesVisible,
    setRepliesCount,
    toggleRepliesVisibility,
    cancelReplying,
    isReplyInputVisible,
    displayReplyInput,
  } = useCommentReply(id, _count.replies);

  const enableEditMode = () => {
    closeMenu();
    setIsEditMode(true);
  };

  const cancelEditMode = () => {
    setIsEditMode(false);
  };

  const onDelete = () => {
    deleteComment(id);
    closeDeleteModal();
  };

  const editComment = (comment: IComment) => {
    setComment(comment);
  };

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  return (
    <>
      {isDeleteModalOpen && (
        <Modal>
          <p>Are you sure you want to delete this comment?</p>
          <div className="flex gap-4 mt-4 justify-center items-center">
            <button
              onClick={closeDeleteModal}
              disabled={isDeleting}
              className={`${
                isDeleting ? "" : "hover:bg-primary-hover"
              } cursor-pointer px-4 py-2 bg-primary/40  transition text-primary-txt font-semibold`}
            >
              Close
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className={`${
                isDeleting
                  ? "bg-primary/40"
                  : "bg-primary hover:bg-primary-hover"
              } cursor-pointer px-4 py-2   transition text-primary-txt font-semibold`}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}

      <div className="flex items-center gap-2 md:gap-4 w-full">
        <img
          src={user?.profilePicture ?? "/blank-pfp.webp"}
          alt=""
          className="size-[30px] sm:size-[40px] rounded-full shrink-0 self-start"
        />

        <div className="flex flex-col w-full">
          <div className="flex items-center w-full gap-3 relative">
            <Link
              to={`/u/${comment?.userId}`}
              className="font-semibold hover:text-primary transition text-sm"
            >
              @{user?.username}
            </Link>
            <p className="text-text-muted text-xs">
              {timeAgo(comment?.createdAt)}
            </p>
            {comment?.createdAt !== comment?.updatedAt && (
              <p className="text-text-muted text-xs">
                (edited)
              </p>
            )}

            {/* Comment options only visible to the creator of comment and the creator of post*/}
            {userData?.id === comment?.userId && (
              <button
                onClick={isOpen ? closeMenu : openMenu}
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
          {isEditMode ? (
            <CommentInput
              postId={comment?.postId}
              commentId={comment?.id}
              refreshComments={getReplies}
              className="mt-4"
              reset={isEditMode ? cancelEditMode : cancelReplying}
              setRepliesCount={setRepliesCount}
              defaultValue={comment?.content}
              isEditMode={isEditMode}
              editComment={editComment}
            />
          ) : (
            <pre className="text-wrap text-sm md:text-[16px] mt-[3px] break-all">
              {comment?.content}
            </pre>
          )}
          <div className="flex items-center gap-6">
            {repliesCount > 0 && (
              <button
                onClick={toggleRepliesVisibility}
                disabled={loading}
                className="cursor-pointer border-none text-sm text-primary hover:text-primary-hover mt-2 transition flex items-center gap-2 shrink-0"
              >
                {!repliesVisible ? (
                  <>
                    <MdKeyboardArrowDown className="text-2xl" /> View{" "}
                    {abbreviateNumber(repliesCount)} {repliesCount > 1 ? "replies" : "reply"}
                  </>
                ) : (
                  <>
                    <MdKeyboardArrowUp className="text-2xl" /> Hide{" "}
                    {repliesCount > 1 ? "replies" : "reply"}
                  </>
                )}
              </button>
            )}
            <button
              onClick={displayReplyInput}
              className="cursor-pointer border-none text-sm text-primary hover:text-primary-hover mt-2 transition flex items-center gap-2 shrink-0"
            >
              Reply
            </button>
          </div>
          {/* Replies */}

          {/* Comment Input to reply on a comment */}
          {isReplyInputVisible && (
            <CommentInput
              postId={comment?.postId}
              repliedToCommentId={comment?.id}
              refreshComments={getReplies}
              className="mt-4"
              reset={cancelReplying}
              setRepliesCount={setRepliesCount}
            />
          )}
          {loading ? (
            Array.from({ length: repliesCount }).map((_, index) => (
              <CommentSkeleton key={index} />
            ))
          ) : error ? (
            <p className="text-center w-full mt-12 flex items-center justify-center gap-4">
              {error}{" "}
              <button
                disabled={loading}
                onClick={getReplies}
                className="border-none text-primary hover:text-primary-hover transition cursor-pointer"
              >
                Retry
              </button>
            </p>
          ) : (
            replies &&
            replies.length > 0 && (
              // Reply Component (Sub-comment)
              <div
                className={`flex-col py-5 gap-6 w-full ${
                  repliesVisible ? "flex" : "hidden"
                }`}
              >
                {replies.map((reply) => (
                  <CommentReply
                    key={reply.id}
                    reply={reply}
                    getReplies={getReplies}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};
export default Comment;
