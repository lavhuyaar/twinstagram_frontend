import { memo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { IoMdHeart } from "react-icons/io";
import { MdOutlineInsertComment } from "react-icons/md";
import type { IPost } from "../interfaces";
import { handleAxiosError } from "../utils/handleAxiosError";
import { axiosInstance } from "../api/axiosInstance";
import useAuth from "../hooks/useAuth";

const Post = memo(
  ({ id, content, userId, user, image, _count, likes }: IPost) => {
    const navigate = useNavigate();
    const { userData } = useAuth();

    const cardOnClick = () => {
      navigate(`/post/${id}`);
    };

    const [post, setPost] = useState<IPost>({
      id,
      content,
      userId,
      user,
      image,
      _count,
      likes,
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

    const thisPostLiked = post?.likes && post.likes[0]?.id === userData?.id;

    return (
      <>
        <div
          onClick={cardOnClick}
          className={`bg-surface w-full md:size-[280px] xl:size-[350px] $ flex flex-col shrink-0 hover:scale-105 transition duration-300 cursor-pointer`}
        >
          <Link
            to={`/users/${post?.userId}`}
            className="flex items-center gap-3 p-3 border-b border-text-muted/20"
          >
            <img
              src={post?.user?.profilePicture ?? "blank-pfp.webp"}
              alt=""
              className="shrink-0 size-[40px] rounded-full object-center object-cover"
            />
            <div>
              <p className="font-medium">{post?.user?.username}</p>
              <p className="text-text-muted text-[11px]">
                {post?.user?.firstName} {post?.user?.lastName}
              </p>
            </div>
          </Link>
          {post?.image ? (
            <div className="size-full">
              <img
                src={post?.image}
                alt=""
                className="size-full object-contain object-center bg-white"
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
                  loading
                    ? "opacity-20"
                    : thisPostLiked
                    ? "fill-primary hover:fill-text-primary"
                    : "fill-text-primary hover:fill-primary-hover"
                } transition`}
              />{" "}
              {post?._count?.likes}
            </span>
            <span className="border-none bg-none p-4 flex items-center gap-1">
              <MdOutlineInsertComment className="text-2xl" />{" "}
              {post?._count?.comments}
            </span>
          </div>
        </div>
      </>
    );
  }
);
export default Post;
