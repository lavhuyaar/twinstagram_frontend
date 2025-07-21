import { memo, useState } from "react";
import { useNavigate } from "react-router";
import { IoMdHeart } from "react-icons/io";
import { MdOutlineInsertComment } from "react-icons/md";
import useAuth from "../hooks/useAuth";
import timeAgo from "../utils/timeAgo";
import { abbreviateNumber } from "../utils/abbreviateNumber";
import type { IPost } from "../interfaces";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";

const Post = memo(
  ({
    id,
    content,
    userId,
    user,
    image,
    _count,
    likes,
    createdAt,
    updatedAt,
  }: IPost) => {
    const [post, setPost] = useState<IPost>({
      id,
      content,
      userId,
      user,
      image,
      _count,
      likes,
      createdAt,
      updatedAt,
    });
    const [loading, setLoading] = useState<boolean>(false);

    const toggleLike = async (event: React.MouseEvent<SVGElement>) => {
      event.stopPropagation();
      if (loading) return;

      setLoading(true);
      try {
        const response = await axiosInstance.post(`/posts/like/${id}`);
        setPost(response.data?.post);
      } catch (err) {
        handleAxiosError(err, "Failed to like the post", undefined);
      } finally {
        setLoading(false);
      }
    };

    const navigate = useNavigate();
    const { userData } = useAuth();

    const cardOnClick = () => {
      navigate(`/p/${post?.id}`);
    };

    const usernameOnClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      navigate(`/u/${post?.userId}`);
    };

    const thisPostLiked = post.likes && post.likes[0]?.id === userData?.id;

    return (
      <>
        <div
          onClick={cardOnClick}
          className={`bg-surface w-full lg:w-2/3 md:min-w-[500px] flex flex-col shrink-0 hover:scale-105 transition duration-300 cursor-pointer`}
        >
          <div className="flex items-center gap-3 p-2 border-b border-text-muted/20">
            <img
              src={post?.user?.profilePicture ?? "/blank-pfp.webp"}
              alt=""
              className="shrink-0 size-[40px] rounded-full object-center object-cover"
            />
            <div>
              <div className="w-full flex items-center gap-3">
                <p
                  onClick={usernameOnClick}
                  className="font-medium hover:text-primary-hover transition"
                >
                  {post?.user?.username}
                </p>{" "}
                <p className="text-text-muted text-xs">
                  {timeAgo(post?.createdAt)}
                </p>
                {post?.createdAt !== post?.updatedAt && (
                  <p className="text-text-muted text-xs">(edited)</p>
                )}
              </div>
              <p className="text-text-muted text-[11px]">
                {post?.user?.firstName} {post?.user?.lastName}
              </p>
            </div>
          </div>
          {post?.image ? (
            <div className="flex flex-col items-center">
              <pre className="p-4 w-full text-xs line-clamp-2 text-wrap">
                {post?.content}
              </pre>
              <img
                src={post?.image ?? "/image-placeholder.jpg"}
                alt=""
                className=" object-contain object-center bg-white mt-2 md:mt-4 w-full max-w-[600px]"
              />
            </div>
          ) : (
            <pre className="p-4 w-full text-xs line-clamp-10 text-wrap">
              {post?.content}
            </pre>
          )}
          <div className="flex items-center gap-2 mt-auto">
            <span className="border-none bg-none p-4 flex items-center gap-1">
              <IoMdHeart
                onClick={toggleLike}
                className={`text-2xl ${
                  thisPostLiked ? "fill-primary" : "fill-text-primary"
                } transition`}
              />{" "}
              {abbreviateNumber(post?._count?.likes)}
            </span>
            <span className="border-none bg-none p-4 flex items-center gap-1">
              <MdOutlineInsertComment className="text-2xl" />{" "}
              {abbreviateNumber(
                post?._count?.comments + post?._count?.subComments
              )}
            </span>
          </div>
        </div>
      </>
    );
  }
);
export default Post;
