import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { MdOutlineInsertComment } from "react-icons/md";
import { IoMdHeart } from "react-icons/io";
import { SlOptionsVertical } from "react-icons/sl";
import { FaArrowLeft } from "react-icons/fa6";
import useAuth from "../hooks/useAuth";
import useOutsideClick from "../hooks/useOutsideClick";
import MainLayout from "../components/MainLayout";
import CommentsSection from "../sections/CommentsSection";
import Error from "../components/Error";
import PostDetailSkeleton from "../components/skeletons/PostDetailSkeleton";
import Modal from "../components/Modal";
import { handleAxiosError } from "../utils/handleAxiosError";
import { axiosInstance } from "../api/axiosInstance";
import timeAgo from "../utils/timeAgo";
import { abbreviateNumber } from "../utils/abbreviateNumber";
import type { IPost } from "../interfaces";

const PostDetail = () => {
  const { postId } = useParams();

  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [likesLoading, setLikesLoading] = useState<boolean>(false);

  // States related to Edit and Delete Post
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [inputValidation, setInputValidation] = useState<string>("");

  const { userData } = useAuth();

  const menuRef = useRef<HTMLDivElement>(null);
  const { isOpen, openMenu, closeMenu } = useOutsideClick(menuRef);
  const navigate = useNavigate();

  const getPost = async () => {
    setError(undefined);
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/posts/post/${postId}`);
      setPost(response.data?.post);
      setInputValue(response.data?.post?.content);
    } catch (err) {
      handleAxiosError(err, undefined, setError, true);
    } finally {
      setLoading(false);
    }
  };

  // Likes/unlikes post
  const toggleLike = async () => {
    setLikesLoading(true);
    try {
      const response = await axiosInstance.post(`/posts/like/${postId}`);
      setPost(response.data?.post);
    } catch (err) {
      handleAxiosError(err, "Failed to like the post", undefined);
    } finally {
      setLikesLoading(false);
    }
  };

  const thisPostLiked = post?.likes && post.likes[0]?.id === userData?.id;

  // Go back to the last route user visited
  const goBack = () => navigate(-1);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const enableEditMode = () => setIsEditMode(true);

  // Cancels edit mode
  const cancelEditing = () => {
    setIsEditMode(false);
    setInputValue(post?.content ?? "");
    setInputValidation("");
    closeMenu();
  };

  // Edits post
  const editPost = async () => {
    if (inputValidation) return;
    if (!inputValue.trim()) {
      setInputValidation("This field cannot be empty");
      return;
    }
    if (inputValue.trim().length > 2000) {
      setInputValidation("Cannot exceed 2000 characters");
      return;
    }

    setIsEditing(true);

    const values: {
      content: string;
      image?: string;
    } = {
      content: inputValue,
    };

    // If post already had an image from before
    if (post?.image) {
      values.image = post.image;
    }

    try {
      const response = await axiosInstance.put(`/posts/${postId}`, values);
      setPost(response.data?.post);
      setIsEditMode(false);
      setInputValue(response.data?.post?.content ?? "");
      setInputValidation("");
      closeMenu();
    } catch (err) {
      handleAxiosError(err, "Failed to edit post!");
    } finally {
      setIsEditing(false);
    }
  };

  // Deletes post
  const deletePost = async () => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      navigate(`/u/${post?.userId}`, { replace: true });
    } catch (err) {
      handleAxiosError(err, "Failed to delete post!");
    } finally {
      setIsDeleting(false);
    }
  };

  const textAreaOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    const trimmed = value.trim();
    if (!trimmed) {
      setInputValidation("This field cannot be empty");
    }
    if (trimmed.length > 2000) {
      setInputValidation("Cannot exceed 2000 characters");
    } else {
      setInputValidation("");
    }

    setInputValue(value);

    // Dynamically changes the height of textarea
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  useEffect(() => {
    if (!postId) return;
    getPost();
  }, []);

  // Error
  if (error) {
    return <Error error={error} onRetry={getPost} />;
  }

  return (
    <>
      <MainLayout>
        <button
          onClick={goBack}
          type="button"
          className="flex items-center gap-3 hover:text-primary-hover cursor-pointer transition self-start mb-4"
        >
          <FaArrowLeft /> Go back
        </button>
        {loading ? (
          <PostDetailSkeleton />
        ) : (
          <>
            <section className={"flex flex-col w-full sm:w-5/6 bg-surface p-6 mt-6"}>
              <section className="flex items-center gap-3 sm:gap-6 border-b border-text-muted/30 pb-4 relative">
                <img
                  src={post?.user?.profilePicture ?? "/blank-pfp.webp"}
                  alt=""
                  className="shrink-0 size-[40px] rounded-full object-center object-cover"
                />
                <div>
                  <div className="w-full flex items-center gap-3">
                    <Link
                      to={`/u/${post?.userId}`}
                      className="font-medium text-lg hover:text-primary transition"
                    >
                      {post?.user?.username}
                    </Link>
                    {post && (
                      <>
                        <p className="text-text-muted text-xs">
                          {timeAgo(post?.createdAt)}
                        </p>
                        {post?.createdAt !== post?.updatedAt && (
                          <p className="hidden sm:block text-text-muted text-xs">
                            (edited {timeAgo(post?.updatedAt)})
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <h4 className="text-text-muted text-xs">
                    {post?.user?.firstName} {post?.user?.lastName}
                  </h4>
                </div>
                {userData?.id === post?.userId && !isEditMode && (
                  <button
                    onClick={isOpen ? closeMenu : openMenu}
                    className="ml-auto md:pr-4 bg-none cursor-pointer"
                  >
                    <SlOptionsVertical />
                  </button>
                )}
                {isOpen && !isEditMode && (
                  <div
                    className="bg-background absolute items-start rounded-md right-10 flex flex-col gap-2 px-6 py-2 top-0 text-start"
                    ref={menuRef}
                  >
                    <button
                      onClick={enableEditMode}
                      className="text-text-primary hover:text-primary-hover transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={openModal}
                      className="text-text-primary hover:text-primary-hover transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </section>
              <section>
                {isEditMode ? (
                  <div className="w-full flex flex-col gap-2 mt-6">
                    <textarea
                      onChange={textAreaOnChange}
                      value={inputValue}
                      name="edit_textarea"
                      id="edit_textarea"
                      placeholder="Share your thoughts..."
                      autoFocus
                      className="resize-none w-full focus:outline-none align-middle"
                    ></textarea>
                    {inputValidation && (
                      <p className="text-red-600 w-full text-sm">
                        {inputValidation}
                      </p>
                    )}
                  </div>
                ) : (
                  <pre className="mt-6 text-[13px] text-wrap w-full">
                    {post?.content}
                  </pre>
                )}
                {post?.image && (
                  <img
                    src={post?.image}
                    alt=""
                    className="w-full object-center object-contain mt-6"
                  />
                )}
              </section>
              <section className="flex items-center gap-8 mt-4">
                <button
                  disabled={likesLoading || isEditing || isDeleting}
                  className="border-none bg-none cursor-pointer flex items-center gap-1"
                >
                  <IoMdHeart
                    onClick={toggleLike}
                    className={`text-2xl ${
                      loading
                        ? "opacity-20"
                        : thisPostLiked
                        ? "fill-primary hover:fill-text-primary"
                        : "fill-text-primary hover:fill-primary-hover"
                    } transition`}
                  />{" "}
                  {abbreviateNumber(post?._count?.likes)}{" "}
                  {post?._count?.likes && post?._count?.likes === 1
                    ? "Like"
                    : post?._count?.likes && post?._count?.likes > 1
                    ? "Likes"
                    : ""}
                </button>
                <button
                  title="View Comments"
                  className="border-none bg-none cursor-pointer flex items-center gap-1"
                >
                  <MdOutlineInsertComment className="text-2xl" />{" "}
                  {abbreviateNumber(
                    post && post?._count?.comments + post?._count?.subComments
                  )}
                </button>
              </section>
              {isEditMode && (
                <div className="self-end flex items-center gap-3">
                  <button
                    disabled={isEditing || isDeleting}
                    onClick={cancelEditing}
                    className={`${
                      isEditing ? "bg-primary/40" : ""
                    } bg-primary/40 hover:bg-primary-hover rounded-2xl text-sm sm:text-[16px] transition px-2 py-1 text-primary-txt font-semibold cursor-pointer`}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isEditing || isDeleting}
                    className={`${isEditing ? "bg-primary/40" : ""} ${
                      !inputValue.trim()
                        ? "bg-primary/40"
                        : "bg-primary hover:bg-primary-hover"
                    } rounded-2xl transition px-4 py-1 text-primary-txt text-sm sm:text-[16px] font-semibold cursor-pointer`}
                    onClick={editPost}
                  >
                    {isEditing ? "Editing Post..." : "Edit Post"}
                  </button>
                </div>
              )}
            </section>
            <CommentsSection postId={post?.id} />
          </>
        )}
      </MainLayout>

      {isModalOpen && (
        <Modal>
          <p>Are you sure you want to delete this post?</p>
          <div className="flex gap-4 mt-4 justify-center items-center">
            <button
              onClick={closeModal}
              disabled={isDeleting}
              className={`${
                isDeleting ? "" : "hover:bg-primary-hover"
              } cursor-pointer px-4 py-2 bg-primary/40  transition text-primary-txt font-semibold`}
            >
              Cancel
            </button>
            <button
              onClick={deletePost}
              disabled={isDeleting}
              className={`${
                isDeleting
                  ? "bg-primary/40"
                  : "bg-primary hover:bg-primary-hover"
              } cursor-pointer px-4 py-2   transition text-primary-txt font-semibold`}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};
export default PostDetail;
