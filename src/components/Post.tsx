import { memo } from "react";
import { Link, useNavigate } from "react-router";
import { IoMdHeart } from "react-icons/io";
import { MdOutlineInsertComment } from "react-icons/md";
import useAuth from "../hooks/useAuth";
import type { IPost } from "../interfaces";
import timeAgo from "../utils/timeAgo";

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
    const navigate = useNavigate();
    const { userData } = useAuth();

    const cardOnClick = () => {
      navigate(`/p/${id}`);
    };

    const thisPostLiked = likes && likes[0]?.id === userData?.id;

    return (
      <>
        <div
          onClick={cardOnClick}
          className={`bg-surface w-full lg:w-2/3 md:min-w-[300px] flex flex-col shrink-0 hover:scale-105 transition duration-300 cursor-pointer`}
        >
          <Link
            to={`/users/${userId}`}
            className="flex items-center gap-3 p-2 border-b border-text-muted/20"
          >
            <img
              src={user?.profilePicture ?? "/blank-pfp.webp"}
              alt=""
              className="shrink-0 size-[40px] rounded-full object-center object-cover"
            />
            <div>
              <div className="w-full flex items-center gap-3">
                <p className="font-medium">{user?.username}</p>{" "}
                <p className="text-text-muted text-xs">
                  {timeAgo(createdAt)}
                </p>
                {createdAt !== updatedAt && (
                  <p className="text-text-muted text-xs">
                    (edited {timeAgo(updatedAt)})
                  </p>
                )}
              </div>
              <p className="text-text-muted text-[11px]">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
          </Link>
          {image ? (
            <div className="flex flex-col items-center">
              <pre className="p-4 w-full text-xs line-clamp-2 text-wrap">
                {content}
              </pre>
              <img
                src={image ?? "/image-placeholder.jpg"}
                alt=""
                className=" object-contain object-center bg-white mt-2 md:mt-4 w-full max-w-[600px]"
              />
            </div>
          ) : (
            <pre className="p-4 w-full text-xs line-clamp-10 text-wrap">
              {content}
            </pre>
          )}
          <div className="flex items-center gap-2 mt-auto">
            <span className="border-none bg-none p-4 flex items-center gap-1">
              <IoMdHeart
                className={`text-2xl ${
                  thisPostLiked ? "fill-primary" : "fill-text-primary"
                } transition`}
              />{" "}
              {_count?.likes}
            </span>
            <span className="border-none bg-none p-4 flex items-center gap-1">
              <MdOutlineInsertComment className="text-2xl" />{" "}
              {_count?.comments + _count?.subComments}
            </span>
          </div>
        </div>
      </>
    );
  }
);
export default Post;
