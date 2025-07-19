import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { MdOutlineInsertComment } from "react-icons/md";
import { IoMdHeart } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import useAuth from "../hooks/useAuth";
import MainLayout from "../components/MainLayout";
import CommentsSection from "../sections/CommentsSection";
import Error from "../components/Error";
import { handleAxiosError } from "../utils/handleAxiosError";
import { axiosInstance } from "../api/axiosInstance";
import type { IPost } from "../interfaces";
import PostDetailSkeleton from "../components/skeletons/PostDetailSkeleton";
import timeAgo from "../utils/timeAgo";

const PostDetail = () => {
  const { postId } = useParams();

  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [likesLoading, setLikesLoading] = useState<boolean>(false);
  const { userData } = useAuth();

  const navigate = useNavigate();

  const getPost = async () => {
    setError(undefined);
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/posts/post/${postId}`);
      setPost(response.data?.post);
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

  useEffect(() => {
    if (!postId) return;
    getPost();
  }, []);

  if (error) {
    return <Error error={error} onRetry={getPost} />;
  }

  const goBack = () => navigate(-1);

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
            <section className="flex flex-col w-full sm:w-5/6 bg-surface p-6 mt-6">
              <section className="flex items-center gap-6 border-b border-text-muted/30 pb-4">
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
                          <p className="text-text-muted text-xs">
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
              </section>
              <section>
                <pre className="mt-6 text-[13px] text-wrap w-full">
                  {post?.content}
                </pre>
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
                  disabled={likesLoading}
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
                  {post?._count?.likes}{" "}
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
                  {post && post?._count?.comments + post?._count?.subComments}
                </button>
              </section>
            </section>
            <CommentsSection postId={post?.id} />
          </>
        )}
      </MainLayout>
    </>
  );
};
export default PostDetail;
