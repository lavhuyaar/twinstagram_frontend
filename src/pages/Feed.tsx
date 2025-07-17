import MainLayout from "../components/MainLayout";
import RedirectToLogin from "../components/RedirectToLogin";
import Post from "../components/Post";
import PostSkeleton from "../components/skeletons/PostSkeleton";
import useFeedPosts from "../hooks/useFeedPosts";
import { Link } from "react-router";

const Feed = () => {
  const { posts, isFetching, fetchMore, hasMore, error } = useFeedPosts();
  return (
    <>
      <RedirectToLogin />
      <MainLayout>
        <div className="flex items-center justify-between gap-4 w-full">
          <h1 className="text-3xl w-full font-medium text-primary self-start">
            My Feed
          </h1>
          <Link
            to="/post/new"
            className="hidden md:block bg-primary shrink-0 text-[14px] px-4 py-1 rounded-md text-primary-txt font-semibold text-center cursor-pointer text-lg border-none hover:bg-primary-hover transition"
          >
            Create New Post
          </Link>
        </div>

        <section className="flex gap-5 flex-wrap mx-auto justify-center justify-self-center my-12">
          {posts.map((post) => (
            <Post {...post} key={post?.id} />
          ))}
          {isFetching &&
            Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))}
        </section>
        {hasMore && <button onClick={fetchMore}>Load more</button>}
        {!hasMore && <p>No data left to load</p>}
        {error && <p>{error}</p>}
      </MainLayout>
    </>
  );
};
export default Feed;
