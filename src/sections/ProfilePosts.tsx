import { useEffect, useState } from "react";
import { MdOutlinePhotoCamera } from "react-icons/md";
import type { IPost } from "../interfaces";
import { axiosInstance } from "../api/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";
import { IoLockClosedOutline } from "react-icons/io5";
import Post from "../components/Post";
import PostSkeleton from "../components/skeletons/PostSkeleton";

const ProfilePosts = ({
  userId,
  postsVisible,
}: {
  userId?: string;
  postsVisible: boolean | undefined;
}) => {
  const [posts, setPosts] = useState<IPost[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const getUserPosts = async (id?: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/posts/user/${userId}`);
      setPosts(response.data?.posts);
    } catch (err) {
      handleAxiosError(err, undefined, setError, true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId || !postsVisible) return;
    getUserPosts(userId);
  }, [userId, postsVisible]);

  if (postsVisible === false) {
    return (
      <section className="items-center flex flex-col p-6 text-center">
        <div className="flex items-center justify-center rounded-full border-2 p-6 size-[100px] shrink-0 border-text-muted">
          <IoLockClosedOutline className="text-5xl text-text-muted" />
        </div>
        <h4 className="text-2xl font-semibold mt-6">This account is private</h4>
        <h6 className="text-text-secondary font-normal text-sm">
          Follow this account to see their posts
        </h6>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full flex min-h-[200px] flex-col items-center justify-center">
        <p className="w-full text-lg text-center">{error}</p>
        <button
          onClick={() => getUserPosts(userId)}
          className="px-4 py-1 text-primary hover:text-primary-hover transition cursor-pointer"
        >
          Retry
        </button>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="flex gap-5 flex-wrap mx-auto justify-center justify-self-center my-12">
        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))}
      </section>
    );
  }

  return (
    <>
      <section className="flex gap-5 w-full flex-wrap justify-center justify-self-center my-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => <Post {...post} key={post?.id} />)
        ) : (
          <div className="items-center flex flex-col text-center">
            <div className="flex items-center justify-center rounded-full border-2 p-6 size-[100px] shrink-0 border-text-muted">
              <MdOutlinePhotoCamera className="text-5xl text-text-muted" />
            </div>
            <h4 className="text-2xl text-text-secondary font-semibold mt-6">
              No posts yet
            </h4>
          </div>
        )}
      </section>
    </>
  );
};
export default ProfilePosts;
